import {useQuery, UseQueryOptions} from "@tanstack/react-query";
import axios from "axios";
import {getQueryKeysFromParamsObject} from "@/lib/utils.ts";
import {
    GETcourseFolderResources,
    GETcourseFolderResourcesApiUrl,
    GETcourseFolderResourcesParams
} from "@/types/api-types/courses/GETcourseFolderResources.ts";

export default function useGETcourseFolderResources(params: GETcourseFolderResourcesParams, queryConfig?: UseQueryOptions<GETcourseFolderResources, Error, GETcourseFolderResources, string[]>) {

    return useQuery(['courseFolderResources', ...getQueryKeysFromParamsObject(params)], async () => {
        const res = await axios.get(GETcourseFolderResourcesApiUrl({
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