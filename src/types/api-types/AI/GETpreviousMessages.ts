import { apiUrl } from "@/lib/utils.ts";

const GETpreviousMessagesApiEndpoint = 'https://itsdu.danielz.dev/api/messages/{elementId}/{userId}?pageIndex={pageIndex}&pageSize={pageSize}'

export const GETpreviousMessagesApiUrl = (params: GETpreviousMessagesParams) => {
    return apiUrl(GETpreviousMessagesApiEndpoint, {
        elementId: params.elementId,
        userId: params.userId,
        pageIndex: params.pageIndex,
        pageSize: params.pageSize
    })
}

export type GETpreviousMessagesParams = {
    elementId: number
    userId: number
    pageIndex?: number
    pageSize?: number
}

export type GETpreviousMessagesResponse = {
    previousMessages: MessageDatabaseType[]
} & MessagesInfiniteOptions

export type MessagesInfiniteOptions = {
    totalMessages: number;
    pageSize: number;
    pageIndex: number;
}

export type MessageRole = "user" | "system"

export type MessageDatabaseType = {
    id: number;
    content: string;
    userId: number;
    elementId: number;
    role: MessageRole;
    timestamp: Date;
}