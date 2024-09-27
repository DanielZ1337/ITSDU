import {SystemNetHttpHttpResponseMessage} from "@/types/api-types/utils/System.Net.Http.HttpResponseMessage.ts";
import {
    ItslearningRestApiEntitiesUpdatableLightBulletinCommentUpdateV1
} from "@/types/api-types/utils/Itslearning.RestApi.Entities.Updatable.LightBulletinCommentUpdateV1.ts";
import {apiUrl} from "@/lib/utils.ts";

const PUTlightbulletinUpdateCommentApiEndpoint = "restapi/personal/lightbulletins/comments/{commentId}/v2"

export const PUTlightbulletinUpdateCommentApiUrl = (params: PUTlightbulletinUpdateCommentParams) => {
    return apiUrl(PUTlightbulletinUpdateCommentApiEndpoint, {
        commentId: params.commentId
    })
}

export type PUTlightbulletinUpdateComment = SystemNetHttpHttpResponseMessage

export type PUTlightbulletinUpdateCommentParams = {
    commentId: number
}

export type PUTlightbulletinUpdateCommentBody = ItslearningRestApiEntitiesUpdatableLightBulletinCommentUpdateV1