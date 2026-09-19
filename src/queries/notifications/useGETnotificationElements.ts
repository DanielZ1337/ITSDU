import axios from "axios";
import { QueryConfig, useQueryCompat } from "@/lib/query-compat";
import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
	GETnotificationElements,
	GETnotificationElementsApiUrl,
	GETnotificationElementsParams,
} from "@/types/api-types/notifications/GETnotificationElements";
import { TanstackKeys } from "../../types/tanstack-keys";

export default function useGETnotificationElements(
	params: GETnotificationElementsParams,
	queryConfig?: QueryConfig<
		GETnotificationElements,
		Error,
		GETnotificationElements,
		string[]
	>,
) {
	return useQueryCompat({
		queryKey: [
			TanstackKeys.NotificationElements,
			...getQueryKeysFromParamsObject(params),
		],

		queryFn: async () => {
			const res = await axios.get(
				GETnotificationElementsApiUrl({
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
