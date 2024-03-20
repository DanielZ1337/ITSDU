import { ItslearningRestApiEntitiesComment } from "@/types/api-types/utils/Itslearning.RestApi.Entities.Comment.ts";
import { apiUrl, ITSLEARNING_API_MAX_SIZE } from "@/lib/utils.ts";

const GETlightbulletinAllCommentsApiEndpoint = "restapi/personal/lightbulletins/{lightBulletinId}/comments/v1?UseNewerThan={UseNewerThan}&FromId={FromId}&PageIndex={PageIndex}&PageSize={PageSize}"

export const GETlightbulletinAllCommentsApiUrl = (params: GETlightbulletinAllCommentsParams) => {
    return apiUrl(GETlightbulletinAllCommentsApiEndpoint, {
        lightBulletinId: params.lightBulletinId,
        UseNewerThan: params.UseNewerThan,
        FromId: params.FromId,
        PageIndex: params.PageIndex,
        PageSize: params.PageSize
    })
}

export type GETlightbulletinAllComments = {
    EntityArray: ItslearningRestApiEntitiesComment[]
    Total: number
    CurrentPageIndex: number
    PageSize: number
}

export type GETlightbulletinAllCommentsParams = {
    lightBulletinId: number
    UseNewerThan?: boolean
    FromId?: number
    PageIndex?: number
    PageSize?: ITSLEARNING_API_MAX_SIZE
}