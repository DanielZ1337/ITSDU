import {useMutation, UseMutationOptions} from "@tanstack/react-query";
import axios from "axios";
import {
    POSTinstantMessagev2,
    POSTinstantMessagev2ApiUrl,
    POSTinstantMessagev2Body
} from "@/types/api-types/messages/POSTinstantMessagev2.ts";
import {TanstackKeys} from "@/types/tanstack-keys";
import {getAccessToken} from "@/lib/utils";

export default function usePOSTinstantMessagev2(queryConfig?: UseMutationOptions<POSTinstantMessagev2, Error, POSTinstantMessagev2Body, string[]>) {

    return useMutation([TanstackKeys.POSTinstantMessagev2], async (body) => {
        const res = await axios.post(POSTinstantMessagev2ApiUrl(), body, {
            params: {
                'access_token': getAccessToken,
            }
        });

        console.log(res);

        if (res.status !== 200) throw new Error(res.statusText);

        return res.data;
    }, {
        ...queryConfig
    })
}