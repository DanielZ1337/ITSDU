import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
	GETnotificationElements,
	GETnotificationElementsApiUrl,
	GETnotificationElementsParams,
} from "@/types/api-types/notifications/GETnotificationElements";
import axios from "axios";
import { TanstackKeys } from "../../types/tanstack-keys";
import { QueryConfig, useQueryCompat } from "@/lib/query-compat";

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

        ...queryConfig
    });
}
