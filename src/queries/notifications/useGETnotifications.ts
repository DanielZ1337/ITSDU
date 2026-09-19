import axios from "axios";
import {
	InfiniteQueryConfig,
	useInfiniteQueryCompat,
} from "@/lib/query-compat";
import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils";
import {
	GETnotifications,
	GETnotificationsApiUrl,
	GETnotificationsParams,
} from "@/types/api-types/notifications/GETnotifications";
import { TanstackKeys } from "@/types/tanstack-keys";

export default function useGETnotifications(
	params: GETnotificationsParams,
	queryConfig?: InfiniteQueryConfig<GETnotifications>,
) {
	return useInfiniteQueryCompat({
		queryKey: [
			TanstackKeys.Notifications,
			...getQueryKeysFromParamsObject(params),
		],
		queryFn: async ({ pageParam }) => {
			const res = await axios.get(
				GETnotificationsApiUrl({
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
