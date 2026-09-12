import { Strategy } from 'passport-jwt';
import { PrismaService } from '../../../database/prisma.service';
export interface JwtPayload {
    sub: string;
    email: string;
    role: string;
}
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly prisma;
    constructor(prisma: PrismaService);
    validate(payload: JwtPayload): Promise<{
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
    } & {
        id: string;
        email: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        passwordHash: string | null;
        status: import(".prisma/client").$Enums.UserStatus;
        isTwoFactorEnabled: boolean;
        twoFactorSecret: string | null;
        googleId: string | null;
        avatarUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
export {};
