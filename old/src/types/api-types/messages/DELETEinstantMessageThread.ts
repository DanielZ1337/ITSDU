import {apiUrl} from "@/lib/utils.ts";

const DELETEinstantMessageThreadApiEndpoint = 'restapi/personal/instantmessages/messagethreads/{threadId}/v1'

export const DELETEinstantMessageThreadApiUrl = (params: DELETEinstantMessageThreadParams) => {
    return apiUrl(DELETEinstantMessageThreadApiEndpoint, {
        threadId: params.threadId
    })
}

export type DELETEinstantMessageThreadParams = {
    threadId: number
}