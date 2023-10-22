import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import axios from "axios";
import { getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
    PUTlightbulletinUpdateComment,
    PUTlightbulletinUpdateCommentApiUrl,
    PUTlightbulletinUpdateCommentBody,
    PUTlightbulletinUpdateCommentParams
} from "@/types/api-types/lightbulletin/PUTlightbulletinUpdateComment.ts";

export default function usePUTlightbulletinUpdateComment(params: PUTlightbulletinUpdateCommentParams, queryConfig?: UseMutationOptions<PUTlightbulletinUpdateComment, Error, PUTlightbulletinUpdateCommentBody, string[]>) {

    return useMutation({
        mutationKey: ['lightbulletinUpdateComment', ...getQueryKeysFromParamsObject(params)], mutationFn: async (body) => {
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
        },
        ...queryConfig
    })
}