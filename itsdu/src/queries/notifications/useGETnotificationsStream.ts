import {
	useInfiniteQuery,
	UseInfiniteQueryOptions,
} from "@tanstack/react-query";
import axios from "axios";
import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils";
import {
	GETnotificationsStream,
	GETnotificationsStreamApiUrl,
	GETnotificationsStreamParams,
} from "@/types/api-types/notifications/GETnotificationsStream";
import { TanstackKeys } from "@/types/tanstack-keys";

export default function useGETnotificationsStream(
	params: GETnotificationsStreamParams,
	queryConfig?: UseInfiniteQueryOptions<
		GETnotificationsStream,
		Error,
		GETnotificationsStream,
		GETnotificationsStream,
		string[]
	>,
) {
	return useInfiniteQuery(
		[TanstackKeys.NotificationsStream, ...getQueryKeysFromParamsObject(params)],
		async ({ pageParam = params.PageIndex }) => {
			const res = await axios.get(
				GETnotificationsStreamApiUrl({
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
