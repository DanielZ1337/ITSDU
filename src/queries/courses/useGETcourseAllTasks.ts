import axios from "axios";
import {
	InfiniteQueryConfig,
	useInfiniteQueryCompat,
} from "@/lib/query-compat";
import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
	GETcourseTasks,
	GETcourseTasksApiUrl,
	GETcourseTasksParams,
} from "@/types/api-types/courses/GETcourseTasks.ts";
import { TanstackKeys } from "@/types/tanstack-keys";

export default function useGETcourseTasks(
	params: GETcourseTasksParams,
	queryConfig?: InfiniteQueryConfig<GETcourseTasks>,
) {
	return useInfiniteQueryCompat({
		queryKey: [
			TanstackKeys.CourseTasklistDailyWorkflow,
			...getQueryKeysFromParamsObject(params),
		],
		queryFn: async ({ pageParam }) => {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			const res = await axios.get(
				GETcourseTasksApiUrl({
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
