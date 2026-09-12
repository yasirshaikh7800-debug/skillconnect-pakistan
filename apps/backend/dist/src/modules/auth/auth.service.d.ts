import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../database/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    private readonly logger;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.UserRole;
            profile: {
                latitude: number | null;
                longitude: number | null;
                provinceId: string | null;
                id: string;
                city: string;
                firstName: string;
                lastName: string;
                createdAt: Date;
                updatedAt: Date;
                address: string | null;
                bio: string | null;
                cityId: string | null;
                districtId: string | null;
                userId: string;
            } | null;
            providerProfile: {
                id: string;
                cnicNumber: string;
                createdAt: Date;
                updatedAt: Date;
                isVerified: boolean;
                hourlyRate: number;
                rating: number;
                totalReviews: number;
                serviceRadiusKm: number;
                availabilityJson: string | null;
                cnicFrontUrl: string | null;
                cnicBackUrl: string | null;
                companyId: string | null;
                userId: string;
            } | null;
        };
    }>;
    login(dto: LoginDto): Promise<{
        requires2FA: boolean;
        message: string;
    } | {
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.UserRole;
            profile: {
                latitude: number | null;
                longitude: number | null;
                provinceId: string | null;
                id: string;
                city: string;
                firstName: string;
                lastName: string;
                createdAt: Date;
                updatedAt: Date;
                address: string | null;
                bio: string | null;
                cityId: string | null;
                districtId: string | null;
                userId: string;
            } | null;
            providerProfile: {
                id: string;
                cnicNumber: string;
                createdAt: Date;
                updatedAt: Date;
                isVerified: boolean;
                hourlyRate: number;
                rating: number;
                totalReviews: number;
                serviceRadiusKm: number;
                availabilityJson: string | null;
                cnicFrontUrl: string | null;
                cnicBackUrl: string | null;
                companyId: string | null;
                userId: string;
            } | null;
        };
        requires2FA?: undefined;
        message?: undefined;
    }>;
    refreshToken(dto: RefreshTokenDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    changePassword(userId: string, dto: ChangePasswordDto): Promise<{
        success: boolean;
        message: string;
    }>;
    generate2FaSecret(userId: string): Promise<{
        secret: string;
        qrCodeUrl: string;
    }>;
    enable2Fa(userId: string, code: string): Promise<{
        success: boolean;
        message: string;
    }>;
    private generateTokens;
}
