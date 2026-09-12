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
exports.CreateBookingDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateBookingDto {
}
exports.CreateBookingDto = CreateBookingDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'service_uuid_here' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "serviceId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-08-10T10:00:00.000Z', description: 'Scheduled date and time' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "scheduledAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'House 42-B, Block 6, PECHS, Karachi' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 24.8607 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateBookingDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 67.0711 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateBookingDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Please bring an extra 15m copper pipe for inverter installation.' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBookingDto.prototype, "notes", void 0);
//# sourceMappingURL=create-booking.dto.js.map