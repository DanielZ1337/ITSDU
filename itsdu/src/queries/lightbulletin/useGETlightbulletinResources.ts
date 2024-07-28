import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";
import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
	GETlightbulletinResources,
	GETlightbulletinResourcesApiUrl,
	GETlightbulletinResourcesParams,
} from "@/types/api-types/lightbulletin/GETlightbulletinResources.ts";
import { TanstackKeys } from "@/types/tanstack-keys";

export default function useGETlightbulletinResources(
	params: GETlightbulletinResourcesParams,
	queryConfig?: UseQueryOptions<
		GETlightbulletinResources,
		Error,
		GETlightbulletinResources,
		string[]
	>,
) {
	return useQuery(
		[
			TanstackKeys.LightbulletinResources,
			...getQueryKeysFromParamsObject(params),
		],
		async () => {
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
		{
			...queryConfig,
		},
	);
}
