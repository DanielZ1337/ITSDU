import {useQuery, UseQueryOptions} from "@tanstack/react-query";
import axios from "axios";
import {getAccessToken, getQueryKeysFromParamsObject} from "@/lib/utils.ts";
import {
    GETpersonalTasks,
    GETpersonalTasksApiUrl,
    GETpersonalTasksParams
} from "@/types/api-types/tasks/GETpersonalTasks.ts";
import {TanstackKeys} from "@/types/tanstack-keys";

export default function useGETpersonalTasks(params: GETpersonalTasksParams, queryConfig?: UseQueryOptions<GETpersonalTasks, Error, GETpersonalTasks, string[]>) {

    return useQuery([TanstackKeys.PersonalTasks, ...getQueryKeysFromParamsObject(params)], async () => {
        const res = await axios.get(GETpersonalTasksApiUrl({
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