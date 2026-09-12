import { PrismaService } from '../../database/prisma.service';
export declare class AdminService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getPlatformStats(): Promise<{
        totalUsers: number;
        totalProviders: number;
        totalBookings: number;
        completedBookings: number;
        pendingVerifications: number;
        grossVolume: number;
        platformRevenueFee: number;
    }>;
    getUnverifiedProviders(): Promise<({
        user: {
            id: string;
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
            email: string;
            phone: string | null;
            createdAt: Date;
        };
    } & {
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
    })[]>;
    verifyProviderCnic(providerProfileId: string, verify: boolean): Promise<{
        success: boolean;
        message: string;
        provider: {
            user: {
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
                email: string;
            };
        } & {
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
        };
    }>;
}
