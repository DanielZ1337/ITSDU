import {useQuery, UseQueryOptions} from "@tanstack/react-query";
import axios from "axios";
import {getQueryKeysFromParamsObject} from "@/lib/utils.ts";
import {
    GETpersonalFollowUpTasks,
    GETpersonalFollowUpTasksApiUrl,
    GETpersonalFollowUpTasksParams
} from "@/types/api-types/tasks/GETpersonalFollowUpTasks.ts";

export default function useGETpersonalFollowUpTasks(params: GETpersonalFollowUpTasksParams, queryConfig?: UseQueryOptions<GETpersonalFollowUpTasks, Error, GETpersonalFollowUpTasks, string[]>) {

    return useQuery(['personalFollowUpTasks', ...getQueryKeysFromParamsObject(params)], async () => {
        const res = await axios.get(GETpersonalFollowUpTasksApiUrl({
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