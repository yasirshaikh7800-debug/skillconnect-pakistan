"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const prisma_service_1 = require("./prisma.service");
describe('PrismaService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [prisma_service_1.PrismaService],
        }).compile();
        service = module.get(prisma_service_1.PrismaService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    it('should connect on module init', async () => {
        const connectSpy = jest.spyOn(service, '$connect').mockImplementation(async () => { });
        await service.onModuleInit();
        expect(connectSpy).toHaveBeenCalledTimes(1);
    });
    it('should disconnect on module destroy', async () => {
        const disconnectSpy = jest.spyOn(service, '$disconnect').mockImplementation(async () => { });
        await service.onModuleDestroy();
        expect(disconnectSpy).toHaveBeenCalledTimes(1);
    });
});
//# sourceMappingURL=prisma.service.spec.js.map