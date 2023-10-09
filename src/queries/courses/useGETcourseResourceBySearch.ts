import {useQuery, UseQueryOptions} from "@tanstack/react-query";
import axios from "axios";
import {getQueryKeysFromParamsObject} from "@/lib/utils.ts";
import {
    GETcourseResourcesBySearch,
    GETcourseResourcesBySearchApiUrl,
    GETcourseResourcesBySearchParams
} from "@/types/api-types/courses/GETcourseResourcesBySearch.ts";

export default function useGETcourseResourceBySearch(params: GETcourseResourcesBySearchParams, queryConfig?: UseQueryOptions<GETcourseResourcesBySearch, Error, GETcourseResourcesBySearch, string[]>) {

    return useQuery(['courseResourcesBySearch', ...getQueryKeysFromParamsObject(params)], async () => {
        const res = await axios.get(GETcourseResourcesBySearchApiUrl({
            ...params
        }), {
            params: {
                "access_token": localStorage.getItem('access_token') || '',
                ...params,
            }
        });

        if (res.status !== 200) throw new Error(res.statusText);

        return res.data;
    }, {
        ...queryConfig
    })
}