import {useMutation, UseMutationOptions} from "@tanstack/react-query";
import {getQueryKeysFromParamsObject} from "@/lib/utils.ts";
import {
    POSTlightbulletinAddCommentApiUrl,
    POSTlightbulletinAddCommentBody,
    POSTlightbulletinAddCommentParams
} from "@/api-types/lightbulletin/POSTlightbulletinAddComment.ts";
import axios from "axios";

export default function usePOSTlightbulletinAddComment(params: POSTlightbulletinAddCommentParams, body: POSTlightbulletinAddCommentBody, queryConfig?: UseMutationOptions<POSTlightbulletinAddCommentBody, Error, POSTlightbulletinAddCommentBody, string[]>) {

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