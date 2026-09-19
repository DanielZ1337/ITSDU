import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
	GETcoursePlansCurrent,
	GETcoursePlansCurrentApiUrl,
	GETcoursePlansCurrentParams,
} from "@/types/api-types/courses/GETcoursePlansCurrent.ts";
import { TanstackKeys } from "@/types/tanstack-keys";
import axios from "axios";
import { QueryConfig, useQueryCompat } from "@/lib/query-compat";

export default function useGETcoursePlansCurrent(
	params: GETcoursePlansCurrentParams,
	queryConfig?: QueryConfig<
		GETcoursePlansCurrent,
		Error,
		GETcoursePlansCurrent,
		string[]
	>,
) {
	return useQueryCompat({
        queryKey: [TanstackKeys.CoursePlansCurrent, ...getQueryKeysFromParamsObject(params)],

        queryFn: async () => {
			const res = await axios.get(
				GETcoursePlansCurrentApiUrl({
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
