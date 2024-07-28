import {useMutation, UseMutationOptions} from "@tanstack/react-query";
import axios from "axios";
import {getAccessToken, getQueryKeysFromParamsObject} from "@/lib/utils.ts";
import {
    DELETEinstantMessageThreadApiUrl,
    DELETEinstantMessageThreadParams
} from "@/types/api-types/messages/DELETEinstantMessageThread.ts";
import {TanstackKeys} from "@/types/tanstack-keys";

export default function useDELETEinstantMessageThread(params: DELETEinstantMessageThreadParams, queryConfig?: UseMutationOptions<undefined, Error, DELETEinstantMessageThreadParams, string[]>) {

    return useMutation([TanstackKeys.DELETEinstantMessageThread, ...getQueryKeysFromParamsObject(params)], async () => {
        const res = await axios.delete(DELETEinstantMessageThreadApiUrl(params), {
            params: {
                "access_token": await getAccessToken() || '',
            }
        });

        if (res.status !== 200) throw new Error(res.statusText);

        return res.data;
    }, {
        ...queryConfig
    })
}