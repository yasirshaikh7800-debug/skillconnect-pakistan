import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class FilterServicesDto {
  @ApiPropertyOptional({ example: 'electrical-wiring' })
  @IsOptional()
  @IsString()
  categorySlug?: string;

  @ApiPropertyOptional({ example: 'punjab' })
  @IsOptional()
  @IsString()
  provinceSlug?: string;

  @ApiPropertyOptional({ example: 'karachi' })
  @IsOptional()
  @IsString()
  citySlug?: string;

  @ApiPropertyOptional({ example: 'Karachi' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: 'wiring' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 'service-id' })
  @IsOptional()
  @IsString()
  serviceId?: string;

  @ApiPropertyOptional({ example: 4.5, description: 'Minimum provider rating' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minRating?: number;

  @ApiPropertyOptional({ example: 1000, description: 'Minimum price in PKR' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minPrice?: number;

  @ApiPropertyOptional({ example: 20000, description: 'Maximum price in PKR' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPrice?: number;

  @ApiPropertyOptional({ example: 24.918 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({ example: 67.0971 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  longitude?: number;

  @ApiPropertyOptional({ example: 15.0, description: 'Radius in kilometers' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  radiusKm?: number;
}
