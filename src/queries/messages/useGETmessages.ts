import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
	GETmessages,
	GETmessagesApiUrl,
	GETmessagesParams,
} from "@/types/api-types/messages/GETmessages.ts";
import { TanstackKeys } from "@/types/tanstack-keys";
import axios from "axios";
import { QueryConfig, useQueryCompat } from "@/lib/query-compat";

export default function useGETmessages(
	params: GETmessagesParams,
	queryConfig?: QueryConfig<GETmessages, Error, GETmessages, string[]>,
) {
	return useQueryCompat({
        queryKey: [TanstackKeys.Messages, ...getQueryKeysFromParamsObject(params)],

        queryFn: async () => {
			console.log("useGETmessages");
			const res = await axios.get(GETmessagesApiUrl(params), {
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
