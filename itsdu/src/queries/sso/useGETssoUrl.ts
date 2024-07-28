import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";
import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
	GETssoUrl,
	GETssoUrlApiUrl,
	GETssoUrlParams,
} from "@/types/api-types/sso/GETssoUrl.ts";
import { TanstackKeys } from "@/types/tanstack-keys";

export default function useGETssoUrl(
	params: GETssoUrlParams,
	queryConfig?: UseQueryOptions<GETssoUrl, Error, GETssoUrl, string[]>,
) {
	return useQuery({
		queryKey: [TanstackKeys.SsoUrl, ...getQueryKeysFromParamsObject(params)],
		queryFn: async () => {
			const res = await axios.get(
				GETssoUrlApiUrl({
					...params,
				}),
				{
					params: {
						access_token: (await getAccessToken()) || "",
						...params,
					},
				},
			);

			if (res.status !== 200) throw new Error(res.statusText);

			return res.data;
		},
		...queryConfig,
	});
}
