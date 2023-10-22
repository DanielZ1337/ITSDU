import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import axios from "axios";
import {
    PUTinstantMessageThreadApiUrl,
    PUTinstantMessageThreadBody,
    PUTinstantMessageThreadParams
} from "@/types/api-types/messages/PUTinstantMessageThread.ts";
import { getQueryKeysFromParamsObject } from "@/lib/utils.ts";

export default function usePUTinstantMessageThread(params: PUTinstantMessageThreadParams, queryConfig?: UseMutationOptions<any, Error, PUTinstantMessageThreadBody, string[]>) {

    return useMutation({
        mutationKey: ['PUTinstantMessageThread', ...getQueryKeysFromParamsObject(params)], mutationFn: async (body) => {
            const res = await axios.put(PUTinstantMessageThreadApiUrl(params), body, {
                params: {
                    'access_token': localStorage.getItem('access_token'),
                }
            });

            console.log(res);

            if (res.status !== 200) throw new Error(res.statusText);

            return res.data;
        },
        ...queryConfig
    })
}