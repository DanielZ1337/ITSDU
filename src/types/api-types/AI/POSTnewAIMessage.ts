import { apiUrl } from "@/lib/utils.ts";

const POSTnewAIMessageApiEndpoint = 'https://itsdu.danielz.dev/api/message/${elementId}'

export const POSTnewAIMessageApiUrl = (params: POSTnewAIMessageParams) => {
    return apiUrl(POSTnewAIMessageApiEndpoint, {
        elementId: params.elementId,
    })
}

export type POSTnewAIMessageBody = {
    message: string
    userId: number
}

export type POSTnewAIMessageParams = {
    elementId: number
}

