import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
	GETunreadInstantMessagesCount,
	GETunreadInstantMessagesCountApiUrl,
} from "@/types/api-types/messages/GETunreadInstantMessagesCount";
import { TanstackKeys } from "@/types/tanstack-keys";
import axios from "axios";
import { QueryConfig, useQueryCompat } from "@/lib/query-compat";

export default function useGETunreadInstantMessageCount(
	queryConfig?: QueryConfig<
		GETunreadInstantMessagesCount,
		Error,
		GETunreadInstantMessagesCount,
		string[]
	>,
) {
	return useQueryCompat({
        queryKey: [TanstackKeys.MessagesUnreadCount, ""],

        queryFn: async () => {
			console.log("useGETunreadInstantMessageCount");
			const res = await axios.get(GETunreadInstantMessagesCountApiUrl(), {
				params: {
					access_token: (await getAccessToken()) || "",
				},
			});

			if (res.status !== 200) throw new Error(res.statusText);

			return res.data;
		},

        ...queryConfig
    });
}
