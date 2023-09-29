import {SystemNetHttpHttpResponseMessage} from "@/api-types/utils/System.Net.Http.HttpResponseMessage.ts";
import {apiUrl} from "@/lib/utils.ts";

const DELETElightbulletinCommentApiEndpoint = "restapi/lightbulletin/comments/{commentId}"

export const DELETElightbulletinCommentApiUrl = (params: DELETElightbulletinCommentParams) => {
    return apiUrl(DELETElightbulletinCommentApiEndpoint, {
        commentId: params.commentId
    })
}

export type DELETElightbulletinComment = SystemNetHttpHttpResponseMessage

export type DELETElightbulletinCommentParams = {
    commentId: number
}