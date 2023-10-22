import {useQuery, UseQueryOptions} from "@tanstack/react-query";
import axios from "axios";
import {getQueryKeysFromParamsObject} from "@/lib/utils.ts";
import {
    GETpersonalTasks,
    GETpersonalTasksApiUrl,
    GETpersonalTasksParams
} from "@/types/api-types/tasks/GETpersonalTasks.ts";

export default function useGETpersonalTasks(params: GETpersonalTasksParams, queryConfig?: UseQueryOptions<GETpersonalTasks, Error, GETpersonalTasks, string[]>) {

    return useQuery(['personalTasks', ...getQueryKeysFromParamsObject(params)], async () => {
        const res = await axios.get(GETpersonalTasksApiUrl({
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