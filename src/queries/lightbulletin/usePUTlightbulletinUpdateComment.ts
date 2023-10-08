import {useMutation, UseMutationOptions} from "@tanstack/react-query";
import axios from "axios";
import {getQueryKeysFromParamsObject} from "@/lib/utils.ts";
import {
    PUTlightbulletinUpdateComment,
    PUTlightbulletinUpdateCommentApiUrl,
    PUTlightbulletinUpdateCommentBody,
    PUTlightbulletinUpdateCommentParams
} from "@/api-types/lightbulletin/PUTlightbulletinUpdateComment.ts";

export default function usePUTlightbulletinUpdateComment(params: PUTlightbulletinUpdateCommentParams, body: PUTlightbulletinUpdateCommentBody, queryConfig?: UseMutationOptions<PUTlightbulletinUpdateComment, Error, PUTlightbulletinUpdateCommentBody, string[]>) {

    return useMutation(['lightbulletinUpdateComment', ...getQueryKeysFromParamsObject(params)], async () => {
        const res = await axios.put(PUTlightbulletinUpdateCommentApiUrl({
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