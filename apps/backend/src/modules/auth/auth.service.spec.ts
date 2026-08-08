import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../database/prisma.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

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

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should reject invalid current passwords during change password', async () => {
    mockPrismaService.user.findUnique.mockResolvedValue({ id: 'user-1', passwordHash: 'hashedPassword' });
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

    await expect(
      service.changePassword('user-1', { currentPassword: 'wrong', newPassword: 'NewPass@123' }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
