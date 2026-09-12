import { PrismaService } from '../../database/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { FilterServicesDto } from './dto/filter-services.dto';
export declare class ServicesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getAllCategories(): Promise<({
        _count: {
            services: number;
        };
    } & {
        id: string;
        description: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        iconUrl: string | null;
    })[]>;
    getServices(query: FilterServicesDto): Promise<({
        category: {
            id: string;
            description: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            iconUrl: string | null;
        };
        provider: {
            user: {
                id: string;
                profile: {
                    latitude: number | null;
                    longitude: number | null;
                    city: string;
                    firstName: string;
                    lastName: string;
                    address: string | null;
                    bio: string | null;
                } | null;
                email: string;
                phone: string | null;
                avatarUrl: string | null;
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
    } & {
        id: string;
        title: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        basePrice: number;
        durationMinutes: number;
        categoryId: string;
        slug: string;
        providerId: string;
        isAvailable: boolean;
    })[]>;
    getServiceById(id: string): Promise<{
        category: {
            id: string;
            description: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            iconUrl: string | null;
        };
        provider: {
            user: {
                id: string;
                profile: {
                    latitude: number | null;
                    longitude: number | null;
                    city: string;
                    firstName: string;
                    lastName: string;
                    address: string | null;
                    bio: string | null;
                } | null;
                email: string;
                phone: string | null;
                avatarUrl: string | null;
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
    } & {
        id: string;
        title: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        basePrice: number;
        durationMinutes: number;
        categoryId: string;
        slug: string;
        providerId: string;
        isAvailable: boolean;
    }>;
    createService(providerUserId: string, dto: CreateServiceDto): Promise<{
        category: {
            id: string;
            description: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            iconUrl: string | null;
        };
    } & {
        id: string;
        title: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        basePrice: number;
        durationMinutes: number;
        categoryId: string;
        slug: string;
        providerId: string;
        isAvailable: boolean;
    }>;
}
