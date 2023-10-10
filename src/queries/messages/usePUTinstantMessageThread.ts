import {useMutation, UseMutationOptions} from "@tanstack/react-query";
import axios from "axios";
import {POSTinstantMessagev2} from "@/types/api-types/messages/POSTinstantMessagev2.ts";
import {
    PUTinstantMessageThreadApiUrl,
    PUTinstantMessageThreadBody,
    PUTinstantMessageThreadParams
} from "@/types/api-types/messages/PUTinstantMessageThread.ts";
import {getQueryKeysFromParamsObject} from "@/lib/utils.ts";

export default function usePUTinstantMessageThread(params: PUTinstantMessageThreadParams, body: PUTinstantMessageThreadBody, queryConfig?: UseMutationOptions<POSTinstantMessagev2, Error, PUTinstantMessageThreadBody, string[]>) {

    return useMutation(['PUTinstantMessageThread', ...getQueryKeysFromParamsObject(params)], async () => {
        const res = await axios.put(PUTinstantMessageThreadApiUrl(params), body, {
            params: {
                'access_token': localStorage.getItem('access_token'),
            }
        });

        console.log(res);

        if (res.status !== 200) throw new Error(res.statusText);

        return res.data;
    }, {
        ...queryConfig
    })
}