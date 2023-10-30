import {useQuery, UseQueryOptions} from "@tanstack/react-query";
import axios from "axios";
import {getAccessToken, getQueryKeysFromParamsObject} from "@/lib/utils.ts";
import {
    GETcourseTasklistDailyWorkflow,
    GETcourseTasklistDailyWorkflowApiUrl,
    GETcourseTasklistDailyWorkflowParams
} from "@/types/api-types/courses/GETcourseTasklistDailyWorkflow.ts";
import {TanstackKeys} from "@/types/tanstack-keys";

export default function useGETcourseTasklistDailyWorkflow(params: GETcourseTasklistDailyWorkflowParams, queryConfig?: UseQueryOptions<GETcourseTasklistDailyWorkflow, Error, GETcourseTasklistDailyWorkflow, string[]>) {

    return useQuery([TanstackKeys.CourseTasklistDailyWorkflow, ...getQueryKeysFromParamsObject(params)], async () => {
        const res = await axios.get(GETcourseTasklistDailyWorkflowApiUrl({
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