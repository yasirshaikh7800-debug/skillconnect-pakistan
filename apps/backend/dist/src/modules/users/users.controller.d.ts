import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(userId: string): Promise<{
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
        wallet: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            balance: number;
            pendingBalance: number;
            currency: string;
            userId: string;
        } | null;
        id: string;
        email: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        status: import(".prisma/client").$Enums.UserStatus;
        isTwoFactorEnabled: boolean;
        googleId: string | null;
        avatarUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<{
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
    }>;
}
