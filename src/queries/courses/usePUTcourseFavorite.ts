import {useMutation, UseMutationOptions} from "@tanstack/react-query";
import axios from "axios";
import {getAccessToken, getQueryKeysFromParamsObject} from "@/lib/utils.ts";
import {
    PUTcourseFavorite,
    PUTcourseFavoriteApiUrl,
    PUTcourseFavoriteParams
} from "@/types/api-types/courses/PUTcourseFavorite.ts";
import {TanstackKeys} from "@/types/tanstack-keys";

export default function usePUTcourseFavorite(params: PUTcourseFavoriteParams, queryConfig?: UseMutationOptions<PUTcourseFavorite, Error, PUTcourseFavoriteParams | undefined, string[]>) {

    return useMutation([TanstackKeys.CourseFavorite, ...getQueryKeysFromParamsObject(params)], async (variables) => {
        const res = await axios.put(PUTcourseFavoriteApiUrl({
            ...(variables || params)
        }), undefined, {
            params: {
                "access_token": await getAccessToken() || '',
                ...(variables || params)
            }
        })

        if (res.status !== 200) throw new Error(res.statusText);

        return res.data;
    }, {
        ...queryConfig
    })
}