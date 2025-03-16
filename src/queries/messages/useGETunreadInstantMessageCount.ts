import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
	GETunreadInstantMessagesCount,
	GETunreadInstantMessagesCountApiUrl,
} from "@/types/api-types/messages/GETunreadInstantMessagesCount";
import { TanstackKeys } from "@/types/tanstack-keys";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function useGETunreadInstantMessageCount(
	queryConfig?: UseQueryOptions<
		GETunreadInstantMessagesCount,
		Error,
		GETunreadInstantMessagesCount,
		string[]
	>,
) {
	return useQuery(
		[TanstackKeys.MessagesUnreadCount, ""],
		async () => {
			console.log("useGETunreadInstantMessageCount");
			const res = await axios.get(GETunreadInstantMessagesCountApiUrl(), {
				params: {
					access_token: (await getAccessToken()) || "",
				},
			});

			if (res.status !== 200) throw new Error(res.statusText);

			return res.data;
		},
		{
			...queryConfig,
		},
	);
}
