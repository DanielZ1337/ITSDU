import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
	GETlightbulletinResources,
	GETlightbulletinResourcesApiUrl,
	GETlightbulletinResourcesParams,
} from "@/types/api-types/lightbulletin/GETlightbulletinResources.ts";
import { TanstackKeys } from "@/types/tanstack-keys";
import axios from "axios";
import { QueryConfig, useQueryCompat } from "@/lib/query-compat";

export default function useGETlightbulletinResources(
	params: GETlightbulletinResourcesParams,
	queryConfig?: QueryConfig<
		GETlightbulletinResources,
		Error,
		GETlightbulletinResources,
		string[]
	>,
) {
	return useQueryCompat({
        queryKey: [
			TanstackKeys.LightbulletinResources,
			...getQueryKeysFromParamsObject(params),
		],

        queryFn: async () => {
			const res = await axios.get(
				GETlightbulletinResourcesApiUrl({
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

        ...queryConfig
    });
}
