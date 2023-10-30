import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";
import { GETcurrentUser, GETcurrentUserApiUrl } from "@/types/api-types/person/GETcurrentUser.ts";
import { TanstackKeys } from "@/types/tanstack-keys";
import { getAccessToken } from "@/lib/utils";

export default function useGETcurrentUser(queryConfig?: UseQueryOptions<GETcurrentUser, Error, GETcurrentUser, string[]>) {

    return useQuery([TanstackKeys.CurrentUser, getAccessToken || ''], async () => {
        const res = await axios.get(GETcurrentUserApiUrl(), {
            params: {
                "access_token": await getAccessToken() || '',
            },
        });

        if (res.status !== 200) throw new Error(res.statusText);

        return res.data;
    }, {
        ...queryConfig
    })
}