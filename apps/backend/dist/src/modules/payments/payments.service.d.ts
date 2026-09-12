import { PrismaService } from '../../database/prisma.service';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
export declare class PaymentsService {
    private readonly prisma;
    private readonly logger;
    private stripe;
    constructor(prisma: PrismaService);
    initiatePayment(userId: string, dto: InitiatePaymentDto): Promise<{
        payment: {
            id: string;
            status: import(".prisma/client").$Enums.PaymentStatus;
            createdAt: Date;
            updatedAt: Date;
            currency: string;
            userId: string;
            bookingId: string;
            method: import(".prisma/client").$Enums.PaymentMethod;
            amount: number;
            transactionId: string | null;
            metadataJson: string | null;
        };
        clientSecret: string | null;
        message: string;
    }>;
    getWallet(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        balance: number;
        pendingBalance: number;
        currency: string;
        userId: string;
    }>;
}
