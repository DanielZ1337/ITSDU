import {useMutation, UseMutationOptions} from "@tanstack/react-query";
import axios from "axios";
import {getQueryKeysFromParamsObject} from "@/lib/utils.ts";
import {
    PUTlightbulletinUpdateComment,
    PUTlightbulletinUpdateCommentApiUrl,
    PUTlightbulletinUpdateCommentBody,
    PUTlightbulletinUpdateCommentParams
} from "@/types/api-types/lightbulletin/PUTlightbulletinUpdateComment.ts";
import {TanstackKeys} from "@/types/tanstack-keys";

export default function usePUTlightbulletinUpdateComment(params: PUTlightbulletinUpdateCommentParams, queryConfig?: UseMutationOptions<PUTlightbulletinUpdateComment, Error, PUTlightbulletinUpdateCommentBody, string[]>) {

    return useMutation([TanstackKeys.LightbulletinUpdateComment, ...getQueryKeysFromParamsObject(params)], async (body) => {
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