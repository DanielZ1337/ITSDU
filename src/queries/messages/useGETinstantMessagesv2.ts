import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
	GETinstantMessagesv2,
	GETinstantMessagesv2ApiUrl,
	GETinstantMessagesv2Params,
} from "@/types/api-types/messages/GETinstantMessagesv2.ts";
import { TanstackKeys } from "@/types/tanstack-keys";
import axios from "axios";
import { InfiniteQueryConfig, useInfiniteQueryCompat } from "@/lib/query-compat";

export default function useGETinstantMessagesv2(
	params: GETinstantMessagesv2Params,
	queryConfig?: InfiniteQueryConfig<GETinstantMessagesv2>,
) {
	return useInfiniteQueryCompat({
		queryKey: [TanstackKeys.Messagesv2, ...getQueryKeysFromParamsObject(params)],
		queryFn: async ({ pageParam }) => {
			console.log("useGETmessages");
			const res = await axios.get(
				GETinstantMessagesv2ApiUrl({
					...params,
					threadPage: pageParam,
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
		initialPageParam: params.threadPage,
		...queryConfig,
		getNextPageParam: (lastPage) => {
				if (
					(lastPage.CurrentPageIndex + 1) * lastPage.PageSize <
					lastPage.Total
				) {
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
