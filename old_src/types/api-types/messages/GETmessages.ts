import {
    ItslearningRestApiEntitiesPersonSimple
} from "@/types/api-types/utils/Itslearning.RestApi.Entities.PersonSimple.ts";
import {apiUrl, ITSLEARNING_API_MAX_PAGESIZE} from "@/lib/utils.ts";

const GETmessagesApiEndpoint = "restapi/personal/messages/v1?UseNewerThan={UseNewerThan}&FromId={FromId}&PageIndex={PageIndex}&PageSize={PageSize}"

export const GETmessagesApiUrl = (params: GETmessagesParams) => {
    return apiUrl(GETmessagesApiEndpoint, {
        UseNewerThan: params.UseNewerThan,
        FromId: params.FromId,
        PageIndex: params.PageIndex,
        PageSize: params.PageSize
    })
}

export type GETmessages = {
    EntityArray: {
        MessageId: number
        From: ItslearningRestApiEntitiesPersonSimple
        DateReceived: Date
        Subject: string
        PreviewText: string
        MessageUrl: string
        ContentUrl: string
        HasAttachments: boolean
        IsRead: boolean
        IsForwarded: boolean
        LastForwardedDate: Date
        IsReplied: boolean
        LastRepliedDate: Date
    }[]
    Total: number
    CurrentPageIndex: number
    PageSize: number
}

export type GETmessagesParams = {
    UseNewerThan?: boolean
    FromId?: number
    PageIndex?: number
    PageSize?: ITSLEARNING_API_MAX_PAGESIZE
}