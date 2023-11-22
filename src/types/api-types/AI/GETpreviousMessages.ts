import { apiUrl } from "@/lib/utils.ts";

const GETpreviousMessagesApiEndpoint = 'https://itsdu.danielz.dev/api/messages/{elementId}/{userId}'

export const GETpreviousMessagesApiUrl = (params: GETpreviousMessagesParams) => {
    return apiUrl(GETpreviousMessagesApiEndpoint, {
        elementId: params.elementId,
        userId: params.userId
    })
}

export type GETpreviousMessagesParams = {
    elementId: number
    userId: number
}

export type GETpreviousMessagesResponse = MessageDatabaseType[]

export type MessageRole = "user" | "system"

export type MessageDatabaseType = {
    id: number;
    content: string;
    userId: number;
    elementId: number;
    role: MessageRole;
    timestamp: Date;
}