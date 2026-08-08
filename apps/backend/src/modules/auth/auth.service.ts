import { Injectable, BadRequestException, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../database/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UserRole, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { authenticator } from 'otplib';
import * as QRCode from 'qrcode';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: dto.email },
          ...(dto.phone ? [{ phone: dto.phone }] : []),
        ],
      },
    });

    if (existingUser) {
      throw new BadRequestException('User with this email or phone already exists');
    }

    if (dto.role === UserRole.PROVIDER && !dto.cnicNumber) {
      throw new BadRequestException('CNIC number is required for Service Providers in Pakistan');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        email: dto.email,
        phone: dto.phone,
        passwordHash,
        role: dto.role,
        status: UserStatus.ACTIVE,
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
        ...(dto.role === UserRole.PROVIDER && dto.cnicNumber
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

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { profile: true, providerProfile: true },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.status === UserStatus.SUSPENDED) {
      throw new UnauthorizedException('Account has been suspended by administration');
    }

    if (user.isTwoFactorEnabled) {
      if (!dto.twoFactorCode) {
        return {
          requires2FA: true,
          message: 'Two-Factor Authentication code is required',
        };
      }
      const isValid2FA = authenticator.verify({
        token: dto.twoFactorCode,
        secret: user.twoFactorSecret || '',
      });

      if (!isValid2FA) {
        throw new UnauthorizedException('Invalid 2FA authentication code');
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

  async refreshToken(dto: RefreshTokenDto) {
    try {
      const payload = await this.jwtService.verifyAsync(dto.refreshToken);
      const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });

      if (!user || user.status === UserStatus.SUSPENDED) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const tokens = this.generateTokens(user.id, user.email, user.role);
      return tokens;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('User account not found');
    }

    const isCurrentPasswordValid = await bcrypt.compare(dto.currentPassword, user.passwordHash);
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.user.update({ where: { id: userId }, data: { passwordHash } });

    return { success: true, message: 'Password updated successfully' };
  }

  async generate2FaSecret(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const secret = authenticator.generateSecret();
    const otpAuthUrl = authenticator.keyuri(
      user.email,
      'SkillConnect Pakistan',
      secret,
    );

    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorSecret: secret },
    });

    const qrCodeUrl = await QRCode.toDataURL(otpAuthUrl);

    return { secret, qrCodeUrl };
  }

  async enable2Fa(userId: string, code: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.twoFactorSecret) {
      throw new BadRequestException('2FA secret has not been generated');
    }

    const isValid = authenticator.verify({
      token: code,
      secret: user.twoFactorSecret,
    });

    if (!isValid) {
      throw new BadRequestException('Invalid authentication code');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { isTwoFactorEnabled: true },
    });

    return { success: true, message: 'Two-Factor Authentication enabled successfully' };
  }

  private generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1d' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return {
      accessToken,
      refreshToken,
    };
  }
}
