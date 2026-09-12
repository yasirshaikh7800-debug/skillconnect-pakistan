import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Verify2FaDto } from './dto/verify-2fa.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    refresh(dto: RefreshTokenDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    changePassword(userId: string, dto: ChangePasswordDto): Promise<{
        success: boolean;
        message: string;
    }>;
    setup2FA(userId: string): Promise<{
        secret: string;
        qrCodeUrl: string;
    }>;
    enable2FA(userId: string, dto: Verify2FaDto): Promise<{
        success: boolean;
        message: string;
    }>;
}
