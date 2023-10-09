import {useQuery, UseQueryOptions} from "@tanstack/react-query";
import axios from "axios";
import {getQueryKeysFromParamsObject} from "@/lib/utils.ts";
import {
    GETcourseFeatures,
    GETcourseFeaturesApiUrl,
    GETcourseFeaturesParams
} from "@/types/api-types/course-features/GETcourseFeatures.ts";

export default function useGETcourseFeatures(params: GETcourseFeaturesParams, queryConfig?: UseQueryOptions<GETcourseFeatures, Error, GETcourseFeatures, string[]>) {

    return useQuery(['courseFeatures', ...getQueryKeysFromParamsObject(params)], async () => {
        const res = await axios.get(GETcourseFeaturesApiUrl({
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