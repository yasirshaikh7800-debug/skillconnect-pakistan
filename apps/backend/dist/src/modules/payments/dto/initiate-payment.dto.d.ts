import { PaymentMethod } from '@prisma/client';
export declare class InitiatePaymentDto {
    bookingId: string;
    method: PaymentMethod;
}
