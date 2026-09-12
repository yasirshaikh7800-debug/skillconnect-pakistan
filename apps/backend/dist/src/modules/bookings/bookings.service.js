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
var BookingsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const client_1 = require("@prisma/client");
let BookingsService = BookingsService_1 = class BookingsService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(BookingsService_1.name);
        this.COMMISSION_RATE = 0.10;
    }
    async createBooking(customerId, dto) {
        const service = await this.prisma.service.findUnique({
            where: { id: dto.serviceId },
            include: { provider: true },
        });
        if (!service || !service.isAvailable) {
            throw new common_1.NotFoundException('Selected service is unavailable');
        }
        const providerUserId = service.provider.userId;
        if (providerUserId === customerId) {
            throw new common_1.BadRequestException('Providers cannot book their own services');
        }
        const totalAmount = service.basePrice;
        const commissionFee = totalAmount * this.COMMISSION_RATE;
        const providerEarning = totalAmount - commissionFee;
        const bookingCode = `SCPK-${Math.floor(100000 + Math.random() * 900000)}`;
        const booking = await this.prisma.booking.create({
            data: {
                bookingCode,
                customerId,
                providerId: providerUserId,
                serviceId: dto.serviceId,
                scheduledAt: new Date(dto.scheduledAt),
                totalAmount,
                commissionFee,
                providerEarning,
                address: dto.address,
                latitude: dto.latitude,
                longitude: dto.longitude,
                notes: dto.notes,
                status: client_1.BookingStatus.PENDING,
                chatRoom: {
                    create: {
                        customerId,
                        providerId: providerUserId,
                    },
                },
            },
            include: {
                service: true,
                customer: { select: { id: true, email: true, profile: true } },
                provider: { select: { id: true, email: true, profile: true } },
                chatRoom: true,
            },
        });
        this.logger.log(`Booking created: ${booking.bookingCode} for service ${service.title}`);
        return booking;
    }
    async getUserBookings(userId, role) {
        return this.prisma.booking.findMany({
            where: role === client_1.UserRole.PROVIDER ? { providerId: userId } : { customerId: userId },
            include: {
                service: true,
                customer: { select: { id: true, email: true, profile: true, phone: true } },
                provider: { select: { id: true, email: true, profile: true, phone: true } },
                payment: true,
                review: true,
                chatRoom: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getBookingById(bookingId, userId) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
            include: {
                service: true,
                customer: { select: { id: true, email: true, profile: true, phone: true } },
                provider: { select: { id: true, email: true, profile: true, phone: true } },
                payment: true,
                review: true,
                chatRoom: true,
            },
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        if (booking.customerId !== userId && booking.providerId !== userId) {
            throw new common_1.ForbiddenException('Access denied to this booking');
        }
        return booking;
    }
    async updateBookingStatus(bookingId, userId, dto) {
        const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        if (booking.customerId !== userId && booking.providerId !== userId) {
            throw new common_1.ForbiddenException('Access denied to modify this booking');
        }
        this.validateStateTransition(booking.status, dto.status);
        const updateData = { status: dto.status };
        if (dto.status === client_1.BookingStatus.COMPLETED) {
            updateData.completedAt = new Date();
            await this.prisma.wallet.upsert({
                where: { userId: booking.providerId },
                update: {
                    balance: { increment: booking.providerEarning },
                },
                create: {
                    userId: booking.providerId,
                    balance: booking.providerEarning,
                    currency: 'PKR',
                },
            });
        }
        else if (dto.status === client_1.BookingStatus.CANCELLED) {
            updateData.cancelledAt = new Date();
        }
        const updatedBooking = await this.prisma.booking.update({
            where: { id: bookingId },
            data: updateData,
            include: {
                service: true,
                payment: true,
            },
        });
        return updatedBooking;
    }
    validateStateTransition(current, target) {
        const allowedTransitions = {
            [client_1.BookingStatus.PENDING]: [client_1.BookingStatus.ACCEPTED, client_1.BookingStatus.CANCELLED],
            [client_1.BookingStatus.ACCEPTED]: [client_1.BookingStatus.IN_PROGRESS, client_1.BookingStatus.CANCELLED],
            [client_1.BookingStatus.IN_PROGRESS]: [client_1.BookingStatus.COMPLETED, client_1.BookingStatus.DISPUTED],
            [client_1.BookingStatus.COMPLETED]: [],
            [client_1.BookingStatus.CANCELLED]: [],
            [client_1.BookingStatus.DISPUTED]: [client_1.BookingStatus.COMPLETED, client_1.BookingStatus.CANCELLED],
        };
        if (!allowedTransitions[current].includes(target)) {
            throw new common_1.BadRequestException(`Invalid booking status transition from ${current} to ${target}`);
        }
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = BookingsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map