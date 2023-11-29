import {useInfiniteQuery, UseInfiniteQueryOptions} from '@tanstack/react-query';
import axios from "axios";
import {getAccessToken, getQueryKeysFromParamsObject} from "@/lib/utils.ts";
import {
    GETcourseTasklistDailyWorkflowCompleted,
    GETcourseTasklistDailyWorkflowCompletedApiUrl,
    GETcourseTasklistDailyWorkflowCompletedParams
} from "@/types/api-types/courses/GETcourseTasklistDailyWorkflowCompleted.ts";
import {TanstackKeys} from "@/types/tanstack-keys";

export default function useGETcourseTasklistDailyWorkflowCompleted(params: GETcourseTasklistDailyWorkflowCompletedParams, queryConfig?: UseInfiniteQueryOptions<GETcourseTasklistDailyWorkflowCompleted, Error, GETcourseTasklistDailyWorkflowCompleted, GETcourseTasklistDailyWorkflowCompleted, string[]>) {

    return useInfiniteQuery([TanstackKeys.CourseTasklistDailyWorkflow, ...getQueryKeysFromParamsObject(params)], async ({pageParam = params.PageIndex || 0}) => {
        const res = await axios.get(GETcourseTasklistDailyWorkflowCompletedApiUrl({
            ...params,
            PageIndex: pageParam
        }), {
            params: {
                "access_token": await getAccessToken() || '',
                ...params,
            }
        });

        if (res.status !== 200) throw new Error(res.statusText);

        return res.data;
    }, {
        ...queryConfig,
        getNextPageParam: (lastPage) => {
            if (lastPage.CurrentPageIndex * lastPage.PageSize < lastPage.Total) {
                return lastPage.CurrentPageIndex + 1;
            } else {
                return undefined;
            }
        },
        getPreviousPageParam: (firstPage) => {
            if (firstPage.CurrentPageIndex > 0) {
                return firstPage.CurrentPageIndex - 1;
            } else {
                return undefined;
            }
        }
    })
}