import {useQuery, UseQueryOptions} from "@tanstack/react-query";
import axios from "axios";
import {getQueryKeysFromParamsObject} from "@/lib/utils.ts";
import {
    GETcourseRootResources,
    GETcourseRootResourcesApiUrl,
    GETcourseRootResourcesParams
} from "@/api-types/courses/GETcourseRootResources.ts";

export default function useGETcourseRootResources(params: GETcourseRootResourcesParams, queryConfig?: UseQueryOptions<GETcourseRootResources, Error, GETcourseRootResources, string[]>) {

    return useQuery(['courseAllResources', ...getQueryKeysFromParamsObject(params)], async () => {
        const res = await axios.get(GETcourseRootResourcesApiUrl({
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