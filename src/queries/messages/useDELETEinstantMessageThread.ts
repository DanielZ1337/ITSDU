import {useMutation, UseMutationOptions} from "@tanstack/react-query";
import axios from "axios";
import {getQueryKeysFromParamsObject} from "@/lib/utils.ts";
import {
    DELETEinstantMessageThreadApiUrl,
    DELETEinstantMessageThreadParams
} from "@/types/api-types/messages/DELETEinstantMessageThread.ts";

export default function useDELETEinstantMessageThread(params: DELETEinstantMessageThreadParams, queryConfig?: UseMutationOptions<undefined, Error, DELETEinstantMessageThreadParams, string[]>) {

    return useMutation(['DELETEinstantMessageThread', ...getQueryKeysFromParamsObject(params)], async () => {
        const res = await axios.delete(DELETEinstantMessageThreadApiUrl(params), {
            params: {
                "access_token": localStorage.getItem('access_token') || '',
            }
        });

        if (res.status !== 200) throw new Error(res.statusText);

        return res.data;
    }, {
        ...queryConfig
    })
}