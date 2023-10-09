import {useQuery, UseQueryOptions} from "@tanstack/react-query";
import axios from "axios";
import {getQueryKeysFromParamsObject} from "@/lib/utils.ts";
import {
    GETcourseFollowUpTasks,
    GETcourseFollowUpTasksApiUrl,
    GETcourseFollowUpTasksParams
} from "@/types/api-types/courses/GETcourseFollowUpTasks.ts";

export default function useGETcourseFollowUpTasks(params: GETcourseFollowUpTasksParams, queryConfig?: UseQueryOptions<GETcourseFollowUpTasks, Error, GETcourseFollowUpTasks, string[]>) {

    return useQuery(['courseFollowUpTasks', ...getQueryKeysFromParamsObject(params)], async () => {
        const res = await axios.get(GETcourseFollowUpTasksApiUrl({
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