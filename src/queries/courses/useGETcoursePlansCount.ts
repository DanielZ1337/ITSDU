import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";
import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import { GETcoursePlansCount, GETcoursePlansCountApiUrl, GETcoursePlansCountParams } from "@/types/api-types/courses/GETcoursePlansCount.ts";
import { TanstackKeys } from "@/types/tanstack-keys";

export default function useGETcoursePlansCount(params: GETcoursePlansCountParams, queryConfig?: UseQueryOptions<GETcoursePlansCount, Error, GETcoursePlansCount, string[]>) {

    return useQuery([TanstackKeys.CoursePlansCount, ...getQueryKeysFromParamsObject(params)], async () => {
        const res = await axios.get(GETcoursePlansCountApiUrl({
            ...params
        }), {
            params: {
                "access_token": await getAccessToken() || '',
                ...params,
            }
        });

        if (res.status !== 200) throw new Error(res.statusText);

        return res.data;
    }, {
        ...queryConfig
    })
}