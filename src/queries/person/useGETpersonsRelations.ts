import axios from "axios";
import { QueryConfig, useQueryCompat } from "@/lib/query-compat";
import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
	GETpersonsRelations,
	GETpersonsRelationsApiUrl,
	GETpersonsRelationsParams,
} from "@/types/api-types/person/GETpersonsRelations.ts";
import { TanstackKeys } from "@/types/tanstack-keys";

export default function useGETpersonsRelations(
	params: GETpersonsRelationsParams,
	queryConfig?: QueryConfig<
		GETpersonsRelations,
		Error,
		GETpersonsRelations,
		string[]
	>,
) {
	return useQueryCompat({
		queryKey: [
			TanstackKeys.PersonsRelations,
			...getQueryKeysFromParamsObject(params),
		],

		queryFn: async () => {
			const res = await axios.get(GETpersonsRelationsApiUrl(params), {
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
