import {
    ItslearningRestApiEntitiesInstantMessageThread
} from "@/types/api-types/utils/Itslearning.RestApi.Entities.InstantMessageThread.ts";
import {
    ItslearningRestApiEntitiesReferencedInstantMessageType
} from "@/types/api-types/utils/Itslearning.RestApi.Entities.ReferencedInstantMessageType.ts";
import {apiUrl} from "@/lib/utils.ts";

const POSTinstantMessagev2ApiEndpoint = 'restapi/personal/instantmessages/v2'

export const POSTinstantMessagev2ApiUrl = () => apiUrl(POSTinstantMessagev2ApiEndpoint)

export type POSTinstantMessagev2 = ItslearningRestApiEntitiesInstantMessageThread

export type POSTinstantMessagev2Body = {
    CourseIds?: number[]
    ProjectIds?: number[]
    FileIds?: string[]
    InstantMessageIdToShare?: number
    InstantMessageIdToReplyTo?: number
    OriginInstantMessageId?: number
    ReferencedInstantMessageType?: ItslearningRestApiEntitiesReferencedInstantMessageType
    OriginMessageThreadId?: number
    ToPersonIds?: number[]
    InstantMessageThreadId?: number
    Text?: string
    SendAsIndividualMessages?: boolean
}