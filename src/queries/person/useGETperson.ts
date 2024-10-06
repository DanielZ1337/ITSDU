import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
	GETperson,
	GETpersonApiUrl,
	GETpersonParams,
} from "@/types/api-types/person/GETperson.ts";
import { TanstackKeys } from "@/types/tanstack-keys";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function useGETperson(
	params: GETpersonParams,
	queryConfig?: UseQueryOptions<GETpersonParams, Error, GETperson, string[]>,
) {
	return useQuery(
		[TanstackKeys.Person, ...getQueryKeysFromParamsObject(params)],
		async () => {
			const res = await axios.get(GETpersonApiUrl(params), {
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
