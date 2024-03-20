//{files: {elementId: number, timestamp: unknown, filename: string | null}[], pageIndex: number, pageSize: number}

import {apiUrl, ITSLEARNING_API_MAX_PAGESIZE} from "@/lib/utils.ts";

const GETpreviousChatsApiEndpoint = 'https://itsdu.danielz.dev/api/chats/{userId}?pageIndex={pageIndex}&pageSize={pageSize}'

export const GETpreviousChatsApiUrl = (params: GETpreviousChatsParams) => {
    return apiUrl(GETpreviousChatsApiEndpoint, {
        userId: params.userId,
        pageIndex: params.pageIndex,
        pageSize: params.pageSize
    })
}

export type GETpreviousChatsParams = {
    userId: number
    pageIndex?: number
    pageSize?: ITSLEARNING_API_MAX_PAGESIZE
}

export type GETpreviousChatsResponse = {
    files: {
        elementId: number;
        timestamp: Date;
        filename: string | null;
    }[];
    pageIndex: number;
    pageSize: number;
    totalFiles: number;
}