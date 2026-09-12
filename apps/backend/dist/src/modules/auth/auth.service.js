"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../../database/prisma.service");
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const otplib_1 = require("otplib");
const QRCode = require("qrcode");
let AuthService = AuthService_1 = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    async register(dto) {
        const existingUser = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { email: dto.email },
                    ...(dto.phone ? [{ phone: dto.phone }] : []),
                ],
            },
        });
        if (existingUser) {
            throw new common_1.BadRequestException('User with this email or phone already exists');
        }
        if (dto.role === client_1.UserRole.PROVIDER && !dto.cnicNumber) {
            throw new common_1.BadRequestException('CNIC number is required for Service Providers in Pakistan');
        }
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const newUser = await this.prisma.user.create({
            data: {
                email: dto.email,
                phone: dto.phone,
                passwordHash,
                role: dto.role,
                status: client_1.UserStatus.ACTIVE,
                profile: {
                    create: {
                        firstName: dto.firstName,
                        lastName: dto.lastName,
                        city: dto.city,
                    },
                },
                wallet: {
                    create: {
                        balance: 0.0,
                        currency: 'PKR',
                    },
                },
                ...(dto.role === client_1.UserRole.PROVIDER && dto.cnicNumber
                    ? {
                        providerProfile: {
                            create: {
                                cnicNumber: dto.cnicNumber,
                                isVerified: false,
                            },
                        },
                    }
                    : {}),
            },
            include: {
                profile: true,
                providerProfile: true,
            },
        });
        this.logger.log(`User registered successfully: ${newUser.id} (${newUser.email})`);
        const tokens = this.generateTokens(newUser.id, newUser.email, newUser.role);
        return {
            user: {
                id: newUser.id,
                email: newUser.email,
                role: newUser.role,
                profile: newUser.profile,
                providerProfile: newUser.providerProfile,
            },
            ...tokens,
        };
    }
    async login(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
            include: { profile: true, providerProfile: true },
        });
        if (!user || !user.passwordHash) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        if (user.status === client_1.UserStatus.SUSPENDED) {
            throw new common_1.UnauthorizedException('Account has been suspended by administration');
        }
        if (user.isTwoFactorEnabled) {
            if (!dto.twoFactorCode) {
                return {
                    requires2FA: true,
                    message: 'Two-Factor Authentication code is required',
                };
            }
            const isValid2FA = otplib_1.authenticator.verify({
                token: dto.twoFactorCode,
                secret: user.twoFactorSecret || '',
            });
            if (!isValid2FA) {
                throw new common_1.UnauthorizedException('Invalid 2FA authentication code');
            }
        }
        const tokens = this.generateTokens(user.id, user.email, user.role);
        return {
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                profile: user.profile,
                providerProfile: user.providerProfile,
            },
            ...tokens,
        };
    }
    async refreshToken(dto) {
        try {
            const payload = await this.jwtService.verifyAsync(dto.refreshToken);
            const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
            if (!user || user.status === client_1.UserStatus.SUSPENDED) {
                throw new common_1.UnauthorizedException('Invalid refresh token');
            }
            const tokens = this.generateTokens(user.id, user.email, user.role);
            return tokens;
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async changePassword(userId, dto) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user || !user.passwordHash) {
            throw new common_1.UnauthorizedException('User account not found');
        }
        const isCurrentPasswordValid = await bcrypt.compare(dto.currentPassword, user.passwordHash);
        if (!isCurrentPasswordValid) {
            throw new common_1.UnauthorizedException('Current password is incorrect');
        }
        const passwordHash = await bcrypt.hash(dto.newPassword, 10);
        await this.prisma.user.update({ where: { id: userId }, data: { passwordHash } });
        return { success: true, message: 'Password updated successfully' };
    }
    async generate2FaSecret(userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        const secret = otplib_1.authenticator.generateSecret();
        const otpAuthUrl = otplib_1.authenticator.keyuri(user.email, 'SkillConnect Pakistan', secret);
        await this.prisma.user.update({
            where: { id: userId },
            data: { twoFactorSecret: secret },
        });
        const qrCodeUrl = await QRCode.toDataURL(otpAuthUrl);
        return { secret, qrCodeUrl };
    }
    async enable2Fa(userId, code) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user || !user.twoFactorSecret) {
            throw new common_1.BadRequestException('2FA secret has not been generated');
        }
        const isValid = otplib_1.authenticator.verify({
            token: code,
            secret: user.twoFactorSecret,
        });
        if (!isValid) {
            throw new common_1.BadRequestException('Invalid authentication code');
        }
        await this.prisma.user.update({
            where: { id: userId },
            data: { isTwoFactorEnabled: true },
        });
        return { success: true, message: 'Two-Factor Authentication enabled successfully' };
    }
    generateTokens(userId, email, role) {
        const payload = { sub: userId, email, role };
        const accessToken = this.jwtService.sign(payload, { expiresIn: '1d' });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
        return {
            accessToken,
            refreshToken,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map