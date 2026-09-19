import axios from "axios";
import {
	InfiniteQueryConfig,
	useInfiniteQueryCompat,
} from "@/lib/query-compat";
import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils";
import {
	GETcourseNotifications,
	GETcourseNotificationsApiUrl,
	GETcourseNotificationsParams,
} from "@/types/api-types/courses/GETcourseNotifications";
import { TanstackKeys } from "@/types/tanstack-keys";

export default function useGETcourseNotifications(
	params: GETcourseNotificationsParams,
	queryConfig?: InfiniteQueryConfig<GETcourseNotifications>,
) {
	return useInfiniteQueryCompat({
		queryKey: [
			TanstackKeys.CourseNotifications,
			...getQueryKeysFromParamsObject(params),
		],
		queryFn: async ({ pageParam }) => {
			const res = await axios.get(
				GETcourseNotificationsApiUrl({
					...params,
					PageIndex: pageParam,
				}),
				{
					params: {
						access_token: (await getAccessToken()) || "",
					},
				},
			);

			if (res.status !== 200) throw new Error(res.statusText);

			return res.data;
		},
		initialPageParam: params.PageIndex,
		...queryConfig,
		getNextPageParam: (lastPage) => {
			console.log(
				lastPage.PageSize,
				lastPage.Total,
				lastPage.CurrentPageIndex,
				lastPage.CurrentPageIndex * lastPage.PageSize < lastPage.Total,
			);
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
