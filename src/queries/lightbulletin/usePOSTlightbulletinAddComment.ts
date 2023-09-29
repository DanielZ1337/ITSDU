import {useMutation, UseMutationOptions} from "@tanstack/react-query";
import axios from "axios";
import {getQueryKeysFromParamsObject} from "@/lib/utils.ts";
import {
    POSTlightbulletinAddComment,
    POSTlightbulletinAddCommentApiUrl,
    POSTlightbulletinAddCommentBody,
    POSTlightbulletinAddCommentParams
} from "@/api-types/lightbulletin/POSTlightbulletinAddComment.ts";

export default function usePOSTlightbulletinAddComment(params: POSTlightbulletinAddCommentParams, body: POSTlightbulletinAddCommentBody, queryConfig?: UseMutationOptions<POSTlightbulletinAddComment, Error, POSTlightbulletinAddComment, string[]>) {

    return useMutation(['lightbulletinAddComment', ...getQueryKeysFromParamsObject(params)], async () => {
        const res = await axios.post(POSTlightbulletinAddCommentApiUrl({
            ...params
        }), body, {
            params: {
                "access_token": localStorage.getItem('access_token') || '',
                ...params,
            }
        });

        if (res.status !== 200) throw new Error(res.statusText);

        return res.data;
    }, {
        ...queryConfig
    })
}