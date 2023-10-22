import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import axios from "axios";
import { getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
    PUTcourseFavorite,
    PUTcourseFavoriteApiUrl,
    PUTcourseFavoriteParams
} from "@/types/api-types/courses/PUTcourseFavorite.ts";

export default function usePUTcourseFavorite(params: PUTcourseFavoriteParams, queryConfig?: UseMutationOptions<PUTcourseFavorite, Error, PUTcourseFavoriteParams | undefined, string[]>) {

    return useMutation({
        mutationKey: ['courseFavorite', ...getQueryKeysFromParamsObject(params)], mutationFn: async (variables) => {
            const res = await axios.put(PUTcourseFavoriteApiUrl({
                ...(variables || params)
            }), undefined, {
                params: {
                    "access_token": localStorage.getItem('access_token') || '',
                    ...(variables || params)
                }
            })

            if (res.status !== 200) throw new Error(res.statusText);

            return res.data;
        },
        ...queryConfig
    })
}