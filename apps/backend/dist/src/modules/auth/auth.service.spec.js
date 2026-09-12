"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const testing_1 = require("@nestjs/testing");
const bcrypt = require("bcrypt");
const prisma_service_1 = require("../../database/prisma.service");
const auth_service_1 = require("./auth.service");
describe('AuthService', () => {
    let service;
    const mockPrismaService = {
        user: {
            findFirst: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
        },
    };
    const mockJwtService = {
        sign: jest.fn().mockReturnValue('mock_jwt_token'),
        verify: jest.fn(),
        verifyAsync: jest.fn(),
    };
    beforeEach(async () => {
        jest.clearAllMocks();
        const module = await testing_1.Test.createTestingModule({
            providers: [
                auth_service_1.AuthService,
                { provide: prisma_service_1.PrismaService, useValue: mockPrismaService },
                { provide: jwt_1.JwtService, useValue: mockJwtService },
            ],
        }).compile();
        service = module.get(auth_service_1.AuthService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    it('should reject invalid current passwords during change password', async () => {
        mockPrismaService.user.findUnique.mockResolvedValue({ id: 'user-1', passwordHash: 'hashedPassword' });
        jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);
        await expect(service.changePassword('user-1', { currentPassword: 'wrong', newPassword: 'NewPass@123' })).rejects.toThrow(common_1.UnauthorizedException);
    });
});
//# sourceMappingURL=auth.service.spec.js.map