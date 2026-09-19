import axios from "axios";
import { QueryConfig, useQueryCompat } from "@/lib/query-compat";
import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
	GETinstantMessagesRecipientsSearch,
	GETinstantMessagesRecipientsSearchApiUrl,
	GETinstantMessagesRecipientsSearchParams,
} from "@/types/api-types/messages/GETinstantMessagesRecipientsSearch.ts";
import { TanstackKeys } from "@/types/tanstack-keys";

export default function useGETinstantMessagesRecipientsSearch(
	params: GETinstantMessagesRecipientsSearchParams,
	queryConfig?: QueryConfig<
		GETinstantMessagesRecipientsSearch,
		Error,
		GETinstantMessagesRecipientsSearch,
		string[]
	>,
) {
	return useQueryCompat({
		queryKey: [
			TanstackKeys.MessagesRecipientsSearch,
			...getQueryKeysFromParamsObject(params),
		],

		queryFn: async () => {
			const res = await axios.get(
				GETinstantMessagesRecipientsSearchApiUrl(params),
				{
					params: {
						access_token: (await getAccessToken()) || "",
					},
				},
			);

			if (res.status !== 200) throw new Error(res.statusText);

			return res.data;
		},

		...queryConfig,
	});
}
