import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
	GETssoUrl,
	GETssoUrlApiUrl,
	GETssoUrlParams,
} from "@/types/api-types/sso/GETssoUrl.ts";
import { TanstackKeys } from "@/types/tanstack-keys";
import axios from "axios";
import { QueryConfig, useQueryCompat } from "@/lib/query-compat";

export default function useGETssoUrl(
	params: GETssoUrlParams,
	queryConfig?: QueryConfig<GETssoUrl, Error, GETssoUrl, string[]>,
) {
	return useQueryCompat({
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

        // just in case the sso url changes
        gcTime: 60 * 1000 * 5,

        ...queryConfig
    });
}
