"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PaymentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const client_1 = require("@prisma/client");
const stripe_1 = require("stripe");
let PaymentsService = PaymentsService_1 = class PaymentsService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(PaymentsService_1.name);
        this.stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY || 'sk_test_mock_stripe_key_pakistan');
    }
    async initiatePayment(userId, dto) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: dto.bookingId },
            include: { service: true, payment: true },
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        if (booking.customerId !== userId) {
            throw new common_1.BadRequestException('Only the customer can initiate payment');
        }
        if (booking.payment && booking.payment.status === client_1.PaymentStatus.PAID) {
            throw new common_1.BadRequestException('Booking has already been paid for');
        }
        const amount = booking.totalAmount;
        let clientSecret = null;
        let transactionId = `TXN-${Date.now()}`;
        if (dto.method === client_1.PaymentMethod.STRIPE) {
            try {
                const paymentIntent = await this.stripe.paymentIntents.create({
                    amount: Math.round(amount * 100),
                    currency: 'pkr',
                    metadata: { bookingId: booking.id, userId },
                });
                clientSecret = paymentIntent.client_secret;
                transactionId = paymentIntent.id;
            }
            catch (err) {
                this.logger.warn(`Stripe API fallback to mock transaction ID: ${err.message}`);
                clientSecret = `mock_stripe_secret_${Date.now()}`;
            }
        }
        else if (dto.method === client_1.PaymentMethod.CASH_ON_DELIVERY) {
            transactionId = `COD-${booking.bookingCode}`;
        }
        const payment = await this.prisma.payment.upsert({
            where: { bookingId: booking.id },
            update: {
                method: dto.method,
                status: dto.method === client_1.PaymentMethod.CASH_ON_DELIVERY ? client_1.PaymentStatus.PAID : client_1.PaymentStatus.PENDING,
                transactionId,
            },
            create: {
                bookingId: booking.id,
                userId,
                amount,
                currency: 'PKR',
                method: dto.method,
                status: dto.method === client_1.PaymentMethod.CASH_ON_DELIVERY ? client_1.PaymentStatus.PAID : client_1.PaymentStatus.PENDING,
                transactionId,
            },
        });
        return {
            payment,
            clientSecret,
            message: dto.method === client_1.PaymentMethod.CASH_ON_DELIVERY
                ? 'Cash on Delivery selected. Pay service provider directly upon job completion.'
                : 'Payment intent initialized successfully.',
        };
    }
    async getWallet(userId) {
        let wallet = await this.prisma.wallet.findUnique({ where: { userId } });
        if (!wallet) {
            wallet = await this.prisma.wallet.create({
                data: { userId, balance: 0.0, currency: 'PKR' },
            });
        }
        return wallet;
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = PaymentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map