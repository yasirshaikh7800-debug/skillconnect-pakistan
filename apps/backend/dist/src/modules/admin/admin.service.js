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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let AdminService = class AdminService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getPlatformStats() {
        const totalUsers = await this.prisma.user.count();
        const totalProviders = await this.prisma.providerProfile.count();
        const totalBookings = await this.prisma.booking.count();
        const completedBookings = await this.prisma.booking.count({ where: { status: 'COMPLETED' } });
        const pendingVerifications = await this.prisma.providerProfile.count({ where: { isVerified: false } });
        const totalRevenue = await this.prisma.booking.aggregate({
            where: { status: 'COMPLETED' },
            _sum: { commissionFee: true, totalAmount: true },
        });
        return {
            totalUsers,
            totalProviders,
            totalBookings,
            completedBookings,
            pendingVerifications,
            grossVolume: totalRevenue._sum.totalAmount || 0,
            platformRevenueFee: totalRevenue._sum.commissionFee || 0,
        };
    }
    async getUnverifiedProviders() {
        return this.prisma.providerProfile.findMany({
            where: { isVerified: false },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        phone: true,
                        profile: true,
                        createdAt: true,
                    },
                },
            },
        });
    }
    async verifyProviderCnic(providerProfileId, verify) {
        const provider = await this.prisma.providerProfile.findUnique({
            where: { id: providerProfileId },
        });
        if (!provider) {
            throw new common_1.NotFoundException('Provider profile not found');
        }
        const updated = await this.prisma.providerProfile.update({
            where: { id: providerProfileId },
            data: { isVerified: verify },
            include: { user: { select: { email: true, profile: true } } },
        });
        return {
            success: true,
            message: verify ? 'Provider CNIC successfully verified' : 'Provider verification revoked',
            provider: updated,
        };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map