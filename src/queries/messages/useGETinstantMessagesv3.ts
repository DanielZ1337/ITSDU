import axios from "axios";
import { QueryConfig, useQueryCompat } from "@/lib/query-compat";
import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
	GETinstantMessagesv3,
	GETinstantMessagesv3ApiUrl,
	GETinstantMessagesv3Params,
} from "@/types/api-types/messages/GETinstantMessagesv3.ts";
import { TanstackKeys } from "@/types/tanstack-keys";

export default function useGETinstantMessagesv3(
	params: GETinstantMessagesv3Params,
	queryConfig?: QueryConfig<
		GETinstantMessagesv3,
		Error,
		GETinstantMessagesv3,
		string[]
	>,
) {
	return useQueryCompat({
		queryKey: [
			TanstackKeys.Messagesv3,
			...getQueryKeysFromParamsObject(params),
		],

		queryFn: async () => {
			console.log("useGETmessages");
			const res = await axios.get(GETinstantMessagesv3ApiUrl(params), {
				params: {
					access_token: (await getAccessToken()) || "",
				},
			});

			if (res.status !== 200) throw new Error(res.statusText);

			return res.data;
		},

		...queryConfig,
	});
}
