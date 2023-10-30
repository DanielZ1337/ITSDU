import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";
import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
    GETcourseResourcesBySearch,
    GETcourseResourcesBySearchApiUrl,
    GETcourseResourcesBySearchParams
} from "@/types/api-types/courses/GETcourseResourcesBySearch.ts";
import { TanstackKeys } from "@/types/tanstack-keys";

export default function useGETcourseResourceBySearch(params: GETcourseResourcesBySearchParams, queryConfig?: UseQueryOptions<GETcourseResourcesBySearch, Error, GETcourseResourcesBySearch, string[]>) {

    return useQuery([TanstackKeys.CourseResourcesBySearch, ...getQueryKeysFromParamsObject(params)], async () => {
        const res = await axios.get(GETcourseResourcesBySearchApiUrl({
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