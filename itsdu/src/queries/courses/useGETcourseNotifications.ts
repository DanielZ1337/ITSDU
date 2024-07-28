import {
	useInfiniteQuery,
	UseInfiniteQueryOptions,
} from "@tanstack/react-query";
import axios from "axios";
import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils";
import {
	GETcourseNotifications,
	GETcourseNotificationsApiUrl,
	GETcourseNotificationsParams,
} from "@/types/api-types/courses/GETcourseNotifications";
import { TanstackKeys } from "@/types/tanstack-keys";

export default function useGETcourseNotifications(
	params: GETcourseNotificationsParams,
	queryConfig?: UseInfiniteQueryOptions<
		GETcourseNotifications,
		Error,
		GETcourseNotifications,
		GETcourseNotifications,
		string[]
	>,
) {
	return useInfiniteQuery(
		[TanstackKeys.CourseNotifications, ...getQueryKeysFromParamsObject(params)],
		async ({ pageParam = params.PageIndex }) => {
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
		{
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
		},
	);
}
