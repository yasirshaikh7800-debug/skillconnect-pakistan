import { PrismaService } from '../../database/prisma.service';
export declare class ChatService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getMessagesByRoom(chatRoomId: string, userId: string): Promise<({
        sender: {
            id: string;
            profile: {
                latitude: number | null;
                longitude: number | null;
                provinceId: string | null;
                id: string;
                city: string;
                firstName: string;
                lastName: string;
                createdAt: Date;
                updatedAt: Date;
                address: string | null;
                bio: string | null;
                cityId: string | null;
                districtId: string | null;
                userId: string;
            } | null;
            email: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        content: string;
        chatRoomId: string;
        senderId: string;
        isRead: boolean;
    })[]>;
    saveMessage(chatRoomId: string, senderId: string, content: string): Promise<{
        sender: {
            id: string;
            profile: {
                latitude: number | null;
                longitude: number | null;
                provinceId: string | null;
                id: string;
                city: string;
                firstName: string;
                lastName: string;
                createdAt: Date;
                updatedAt: Date;
                address: string | null;
                bio: string | null;
                cityId: string | null;
                districtId: string | null;
                userId: string;
            } | null;
            email: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        content: string;
        chatRoomId: string;
        senderId: string;
        isRead: boolean;
    }>;
}
