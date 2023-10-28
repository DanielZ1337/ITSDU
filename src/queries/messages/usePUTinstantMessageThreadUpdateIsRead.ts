import {useMutation, UseMutationOptions} from "@tanstack/react-query";
import axios from "axios";
import {
    PUTinstantMessageThreadUpdateIsReadApiUrl,
    PUTinstantMessageThreadUpdateIsReadParams
} from "@/types/api-types/messages/PUTinstantMessageThreadUpdateIsRead.ts";
import {TanstackKeys} from "@/types/tanstack-keys";

export default function usePUTinstantMessageThreadUpdateIsRead(params?: PUTinstantMessageThreadUpdateIsReadParams, queryConfig?: UseMutationOptions<undefined, Error, PUTinstantMessageThreadUpdateIsReadParams, string[]>) {

    return useMutation([TanstackKeys.PUTinstantMessageThreadUpdateIsRead], async (body: PUTinstantMessageThreadUpdateIsReadParams) => {
        const res = await axios.put(PUTinstantMessageThreadUpdateIsReadApiUrl(body || params), {
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