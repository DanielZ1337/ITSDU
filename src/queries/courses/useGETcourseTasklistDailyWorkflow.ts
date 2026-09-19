import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
	GETcourseTasklistDailyWorkflow,
	GETcourseTasklistDailyWorkflowApiUrl,
	GETcourseTasklistDailyWorkflowParams,
} from "@/types/api-types/courses/GETcourseTasklistDailyWorkflow.ts";
import { TanstackKeys } from "@/types/tanstack-keys";
import axios from "axios";
import { InfiniteQueryConfig, useInfiniteQueryCompat } from "@/lib/query-compat";

export default function useGETcourseTasklistDailyWorkflow(
	params: GETcourseTasklistDailyWorkflowParams,
	queryConfig?: InfiniteQueryConfig<GETcourseTasklistDailyWorkflow>,
) {
	return useInfiniteQueryCompat({
		queryKey: [
			TanstackKeys.CourseTasklistDailyWorkflow,
			...getQueryKeysFromParamsObject(params),
		],
		queryFn: async ({ pageParam }) => {
			const res = await axios.get(
				GETcourseTasklistDailyWorkflowApiUrl({
					...params,
					PageIndex: pageParam,
				}),
				{
					params: {
						access_token: (await getAccessToken()) || "",
						...params,
					},
				},
			);

			if (res.status !== 200) throw new Error(res.statusText);

			return res.data;
		},
		initialPageParam: params.PageIndex || 0,
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
			},
	});
}
