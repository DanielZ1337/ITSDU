import {useMutation, UseMutationOptions} from "@tanstack/react-query";
import axios from "axios";
import {getQueryKeysFromParamsObject} from "@/lib/utils.ts";
import {
    POSTcourseAllResources,
    POSTcourseAllResourcesApiUrl,
    POSTcourseAllResourcesBody,
    POSTcourseAllResourcesParams
} from "@/types/api-types/courses/POSTcourseAllResources.ts";

export default function usePOSTcourseAllResources(params: POSTcourseAllResourcesParams, body: POSTcourseAllResourcesBody, queryConfig?: UseMutationOptions<POSTcourseAllResources, Error, POSTcourseAllResources, string[]>) {

    return useMutation(['courseAllResources', ...getQueryKeysFromParamsObject(params)], async () => {
        const res = await axios.post(POSTcourseAllResourcesApiUrl({
            ...params
        }), body, {
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