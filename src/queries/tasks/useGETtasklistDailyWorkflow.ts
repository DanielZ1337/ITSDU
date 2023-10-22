import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";
import { getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
    GETtasklistDailyWorkflow,
    GETtasklistDailyWorkflowApiUrl,
    GETtasklistDailyWorkflowParams
} from "@/types/api-types/tasks/GETtasklistDailyWorkflow.ts";

export default function useGETtasklistDailyWorkflow(params: GETtasklistDailyWorkflowParams, queryConfig?: UseQueryOptions<GETtasklistDailyWorkflow, Error, GETtasklistDailyWorkflow, string[]>) {

    return useQuery({
        queryKey: ["tasklistDailyWorkflow", ...getQueryKeysFromParamsObject(params)],
        queryFn: async () => {
            const res = await axios.get(GETtasklistDailyWorkflowApiUrl({
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