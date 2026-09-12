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
exports.ServicesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let ServicesService = class ServicesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllCategories() {
        return this.prisma.category.findMany({
            include: {
                _count: { select: { services: true } },
            },
            orderBy: { name: 'asc' },
        });
    }
    async getServices(query) {
        const { categorySlug, city, search, provinceSlug, citySlug, serviceId, minPrice, maxPrice, minRating } = query;
        const priceFilter = {
            ...(minPrice !== undefined ? { gte: minPrice } : {}),
            ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
        };
        const province = provinceSlug
            ? await this.prisma.province.findUnique({ where: { slug: provinceSlug }, select: { id: true } })
            : null;
        const matchedCity = citySlug
            ? await this.prisma.city.findFirst({ where: { slug: citySlug }, select: { id: true } })
            : null;
        const services = await this.prisma.service.findMany({
            where: {
                isAvailable: true,
                ...(categorySlug ? { category: { slug: categorySlug } } : {}),
                ...(province?.id ? { provider: { user: { profile: { provinceId: province.id } } } } : {}),
                ...(matchedCity?.id ? { provider: { user: { profile: { cityId: matchedCity.id } } } } : {}),
                ...(city ? { provider: { user: { profile: { city: { contains: city, mode: 'insensitive' } } } } } : {}),
                ...(serviceId ? { id: serviceId } : {}),
                ...(Object.keys(priceFilter).length ? { basePrice: priceFilter } : {}),
                ...(minRating !== undefined ? { provider: { rating: { gte: minRating } } } : {}),
                ...(search
                    ? {
                        OR: [
                            { title: { contains: search, mode: 'insensitive' } },
                            { description: { contains: search, mode: 'insensitive' } },
                        ],
                    }
                    : {}),
            },
            include: {
                category: true,
                provider: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                                phone: true,
                                avatarUrl: true,
                                profile: {
                                    select: {
                                        firstName: true,
                                        lastName: true,
                                        city: true,
                                        address: true,
                                        latitude: true,
                                        longitude: true,
                                        bio: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        return services;
    }
    async getServiceById(id) {
        const service = await this.prisma.service.findUnique({
            where: { id },
            include: {
                category: true,
                provider: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                                phone: true,
                                avatarUrl: true,
                                profile: {
                                    select: {
                                        firstName: true,
                                        lastName: true,
                                        city: true,
                                        address: true,
                                        latitude: true,
                                        longitude: true,
                                        bio: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        if (!service) {
            throw new common_1.NotFoundException('Service not found');
        }
        return service;
    }
    async createService(providerUserId, dto) {
        const providerProfile = await this.prisma.providerProfile.findUnique({
            where: { userId: providerUserId },
        });
        if (!providerProfile) {
            throw new common_1.BadRequestException('User does not have an active Service Provider profile');
        }
        return this.prisma.service.create({
            data: {
                providerId: providerProfile.id,
                categoryId: dto.categoryId,
                title: dto.title,
                description: dto.description,
                basePrice: dto.basePrice,
                durationMinutes: dto.durationMinutes || 60,
            },
            include: {
                category: true,
            },
        });
    }
};
exports.ServicesService = ServicesService;
exports.ServicesService = ServicesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ServicesService);
//# sourceMappingURL=services.service.js.map