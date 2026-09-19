import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
	GETperson,
	GETpersonApiUrl,
	GETpersonParams,
} from "@/types/api-types/person/GETperson.ts";
import { TanstackKeys } from "@/types/tanstack-keys";
import axios from "axios";
import { QueryConfig, useQueryCompat } from "@/lib/query-compat";

export default function useGETperson(
	params: GETpersonParams,
	queryConfig?: QueryConfig<GETpersonParams, Error, GETperson, string[]>,
) {
	return useQueryCompat({
        queryKey: [TanstackKeys.Person, ...getQueryKeysFromParamsObject(params)],

        queryFn: async () => {
			const res = await axios.get(GETpersonApiUrl(params), {
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
