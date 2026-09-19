import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
	GETcoursePlansPast,
	GETcoursePlansPastApiUrl,
	GETcoursePlansPastParams,
} from "@/types/api-types/courses/GETcoursePlansPast.ts";
import { TanstackKeys } from "@/types/tanstack-keys";
import axios from "axios";
import { QueryConfig, useQueryCompat } from "@/lib/query-compat";

export default function useGETcoursePlansPast(
	params: GETcoursePlansPastParams,
	queryConfig?: QueryConfig<
		GETcoursePlansPast,
		Error,
		GETcoursePlansPast,
		string[]
	>,
) {
	return useQueryCompat({
        queryKey: [TanstackKeys.CoursePlansPast, ...getQueryKeysFromParamsObject(params)],

        queryFn: async () => {
			const res = await axios.get(
				GETcoursePlansPastApiUrl({
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
