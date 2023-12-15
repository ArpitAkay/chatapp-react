export interface Message {
    id?: number;
    content: string;
    senderId: number;
    senderName: string;
    receiverId?: number;
    receiverName?: string;
    timestamp: Date;
}