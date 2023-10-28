import {useQuery, UseQueryOptions} from "@tanstack/react-query";
import axios from "axios";
import {getQueryKeysFromParamsObject} from "@/lib/utils.ts";
import {
    GETpersonalTasklistDailyWorkflow,
    GETpersonalTasklistDailyWorkflowApiUrl,
    GETpersonalTasklistDailyWorkflowParams
} from "@/types/api-types/tasks/GETpersonalTasklistDailyWorkflow";
import {TanstackKeys} from "@/types/tanstack-keys";

export default function useGETpersonalTasklistDailyWorkflow(params: GETpersonalTasklistDailyWorkflowParams, queryConfig?: UseQueryOptions<GETpersonalTasklistDailyWorkflow, Error, GETpersonalTasklistDailyWorkflow, string[]>) {

    return useQuery([TanstackKeys.PersonalTasklistDailyWorkflow, ...getQueryKeysFromParamsObject(params)], async () => {
        const res = await axios.get(GETpersonalTasklistDailyWorkflowApiUrl({
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