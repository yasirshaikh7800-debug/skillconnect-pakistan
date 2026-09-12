import { ChatService } from './chat.service';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    getRoomMessages(roomId: string, userId: string): Promise<({
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
}
