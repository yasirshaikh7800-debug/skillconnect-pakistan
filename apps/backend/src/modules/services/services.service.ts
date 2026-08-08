import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { FilterServicesDto } from './dto/filter-services.dto';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllCategories() {
    return this.prisma.category.findMany({
      include: {
        _count: { select: { services: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  async getServices(query: FilterServicesDto) {
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

  async getServiceById(id: string) {
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
      throw new NotFoundException('Service not found');
    }

    return service;
  }

  async createService(providerUserId: string, dto: CreateServiceDto) {
    const providerProfile = await this.prisma.providerProfile.findUnique({
      where: { userId: providerUserId },
    });

    if (!providerProfile) {
      throw new BadRequestException('User does not have an active Service Provider profile');
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
}
