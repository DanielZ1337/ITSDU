import axios from "axios";
import { QueryConfig, useQueryCompat } from "@/lib/query-compat";
import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
	GETnotificationsTopMenu,
	GETnotificationsTopMenuApiParams,
	GETnotificationsTopMenuApiUrl,
} from "@/types/api-types/notifications/GETnotifcationsTopMenu";
import { TanstackKeys } from "@/types/tanstack-keys";

export default function useGETnotificationsTopMenu(
	params: GETnotificationsTopMenuApiParams,
	queryConfig?: QueryConfig<
		GETnotificationsTopMenuApiParams,
		Error,
		GETnotificationsTopMenu,
		string[]
	>,
) {
	return useQueryCompat({
		queryKey: [
			TanstackKeys.NotificationsTopMenu,
			...getQueryKeysFromParamsObject(params),
		],

		queryFn: async () => {
			const res = await axios.get(GETnotificationsTopMenuApiUrl(params), {
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
