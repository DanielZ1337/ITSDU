import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
	GETcourseTasklistDailyWorkflowApiViewasUrl,
	GETcourseTasklistDailyWorkflowParams,
	GETcourseTasklistDailyWorkflowViewas,
} from "@/types/api-types/courses/GETcourseTasklistDailyWorkflowViewas.ts";
import { TanstackKeys } from "@/types/tanstack-keys";
import {
	UseInfiniteQueryOptions,
	useInfiniteQuery,
} from "@tanstack/react-query";
import axios from "axios";

export default function useGETcourseTasklistDailyWorkflowViewas(
	params: GETcourseTasklistDailyWorkflowParams,
	queryConfig?: UseInfiniteQueryOptions<
		GETcourseTasklistDailyWorkflowViewas,
		Error,
		GETcourseTasklistDailyWorkflowViewas,
		GETcourseTasklistDailyWorkflowViewas,
		string[]
	>,
) {
	return useInfiniteQuery(
		[
			TanstackKeys.CourseTasklistDailyWorkflow,
			...getQueryKeysFromParamsObject(params),
		],
		async ({ pageParam = params.PageIndex || 0 }) => {
			const res = await axios.get(
				GETcourseTasklistDailyWorkflowApiViewasUrl({
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
		{
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
		},
	);
}
