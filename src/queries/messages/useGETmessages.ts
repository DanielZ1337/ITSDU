import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
	GETmessages,
	GETmessagesApiUrl,
	GETmessagesParams,
} from "@/types/api-types/messages/GETmessages.ts";
import { TanstackKeys } from "@/types/tanstack-keys";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function useGETmessages(
	params: GETmessagesParams,
	queryConfig?: UseQueryOptions<GETmessages, Error, GETmessages, string[]>,
) {
	return useQuery(
		[TanstackKeys.Messages, ...getQueryKeysFromParamsObject(params)],
		async () => {
			console.log("useGETmessages");
			const res = await axios.get(GETmessagesApiUrl(params), {
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
