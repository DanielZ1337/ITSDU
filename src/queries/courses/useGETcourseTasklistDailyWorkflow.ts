import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";
import { getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
    GETcourseTasklistDailyWorkflow,
    GETcourseTasklistDailyWorkflowApiUrl,
    GETcourseTasklistDailyWorkflowParams
} from "@/types/api-types/courses/GETcourseTasklistDailyWorkflow.ts";

export default function useGETcourseTasklistDailyWorkflow(params: GETcourseTasklistDailyWorkflowParams, queryConfig?: UseQueryOptions<GETcourseTasklistDailyWorkflow, Error, GETcourseTasklistDailyWorkflow, string[]>) {

    return useQuery({
        queryKey: ['courseTasklistDailyWorkflow', ...getQueryKeysFromParamsObject(params)], queryFn: async () => {
            const res = await axios.get(GETcourseTasklistDailyWorkflowApiUrl({
                ...params
            }), {
                params: {
                    "access_token": localStorage.getItem('access_token') || '',
                    ...params,
                }
            });

            if (res.status !== 200) throw new Error(res.statusText);

            return res.data;
        },
        ...queryConfig
    })
}