import axios from "axios";
import { QueryConfig, useQueryCompat } from "@/lib/query-compat";
import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
	GETbulletin,
	GETbulletinApiUrl,
	GETbulletinParams,
} from "@/types/api-types/lightbulletin/GETbulletin.ts";
import { TanstackKeys } from "../../types/tanstack-keys";

export default function useGETbulletin(
	params: GETbulletinParams,
	queryConfig?: QueryConfig<GETbulletin, Error, GETbulletin, string[]>,
) {
	return useQueryCompat({
		queryKey: [TanstackKeys.Bulletin, ...getQueryKeysFromParamsObject(params)],

		queryFn: async () => {
			const res = await axios.get(
				GETbulletinApiUrl({
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
