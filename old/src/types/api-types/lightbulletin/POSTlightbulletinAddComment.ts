import {ItslearningRestApiEntitiesComment} from "@/types/api-types/utils/Itslearning.RestApi.Entities.Comment.ts";
import {
    ItslearningRestApiEntitiesUpdatableLightBulletinCommentUpdateV1
} from "@/types/api-types/utils/Itslearning.RestApi.Entities.Updatable.LightBulletinCommentUpdateV1.ts";
import {apiUrl} from "@/lib/utils.ts";

const POSTlightbulletinAddCommentApiEndpoint = "restapi/personal/lightbulletins/{lightBulletinId}/comments/v2"

export const POSTlightbulletinAddCommentApiUrl = (params: POSTlightbulletinAddCommentParams) => {
    return apiUrl(POSTlightbulletinAddCommentApiEndpoint, {
        lightBulletinId: params.lightBulletinId
    })
}

export type POSTlightbulletinAddComment = ItslearningRestApiEntitiesComment

export type POSTlightbulletinAddCommentParams = {
    lightBulletinId: number
}

export type POSTlightbulletinAddCommentBody = ItslearningRestApiEntitiesUpdatableLightBulletinCommentUpdateV1