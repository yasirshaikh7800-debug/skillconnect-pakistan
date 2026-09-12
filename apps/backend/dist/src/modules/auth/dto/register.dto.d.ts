import { UserRole } from '@prisma/client';
export declare class RegisterDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    city: string;
    phone?: string;
    role: UserRole;
    cnicNumber?: string;
}
