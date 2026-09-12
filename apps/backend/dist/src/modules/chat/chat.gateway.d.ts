import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly chatService;
    server: Server;
    private readonly logger;
    constructor(chatService: ChatService);
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoinRoom(client: Socket, data: {
        roomId: string;
    }): {
        event: string;
        roomId: string;
    };
    handleSendMessage(client: Socket, data: {
        roomId: string;
        senderId: string;
        content: string;
    }): Promise<{
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
    handleTyping(client: Socket, data: {
        roomId: string;
        userId: string;
        isTyping: boolean;
    }): void;
}
