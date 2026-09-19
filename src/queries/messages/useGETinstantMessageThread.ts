import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
	GETinstantMessageThread,
	GETinstantMessageThreadApiUrl,
	GETinstantMessageThreadParams,
} from "@/types/api-types/messages/GETinstantMessageThread.ts";
import { TanstackKeys } from "@/types/tanstack-keys";
import axios from "axios";
import { QueryConfig, useQueryCompat } from "@/lib/query-compat";

export default function useGETinstantMessageThread(
	params: GETinstantMessageThreadParams,
	queryConfig?: QueryConfig<
		GETinstantMessageThread,
		Error,
		GETinstantMessageThread,
		string[]
	>,
) {
	return useQueryCompat({
        queryKey: [TanstackKeys.MessageThread, ...getQueryKeysFromParamsObject(params)],

        queryFn: async () => {
			const res = await axios.get(GETinstantMessageThreadApiUrl(params), {
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
