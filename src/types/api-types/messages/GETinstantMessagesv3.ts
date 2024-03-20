//https://sdu.itslearning.com/restapi/personal/instantmessages/messagethreads/v2?threadPage=0&maxThreadCount=15

import {
    ItslearningRestApiEntitiesInstantMessageThread
} from "@/types/api-types/utils/Itslearning.RestApi.Entities.InstantMessageThread.ts";
import { apiUrl, ITSLEARNING_API_MAX_SIZE } from "@/lib/utils.ts";

const GETinstantMessagesv3ApiEndpoint = "restapi/personal/instantmessages/messagethreads/v3?fromSortIndex={fromSortIndex}&pageSize={pageSize}"

export const GETinstantMessagesv3ApiUrl = (params: GETinstantMessagesv3Params) => {
    return apiUrl(GETinstantMessagesv3ApiEndpoint, {
        fromSortIndex: params.fromSortIndex,
        pageSize: params.pageSize
    })
}

export type GETinstantMessagesv3 = {
    Threads: {
        EntityArray: ItslearningRestApiEntitiesInstantMessageThread[]
        Total: number
        CurrentPageIndex: number
        PageSize: number
    }
    HasMore: boolean
}

export type GETinstantMessagesv3Params = {
    fromSortIndex?: number
    pageSize?: ITSLEARNING_API_MAX_SIZE
}