import { apiUrl, ITSLEARNING_API_MAX_SIZE } from "@/lib/utils";
import {
    EntityListOfItslearningRestApiEntitiesInstantMessage
} from "../utils/EntityListOfItslearning.RestApi.Entities.InstantMessage";

const GETinstantMessagesForThreadApiEndpoint = 'restapi/personal/instantmessages/messagethreads/{threadId}/messages/v3?pageSize={pageSize}&fromId={fromId}'

export const GETinstantMessagesForThreadApiUrl = (params: GETinstantMessagesForThreadParams) => {
    return apiUrl(GETinstantMessagesForThreadApiEndpoint, {
        threadId: params.threadId,
        pageSize: params.pageSize,
        fromId: params.fromId
    })
}

export type GETinstantMessagesForThread = {
    Messages: EntityListOfItslearningRestApiEntitiesInstantMessage
    HasMore: boolean
}

export type GETinstantMessagesForThreadParams = {
    threadId: number
    pageSize?: ITSLEARNING_API_MAX_SIZE
    fromId?: number
}