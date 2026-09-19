import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
	GETcoursePlans,
	GETcoursePlansApiUrl,
	GETcoursePlansParams,
} from "@/types/api-types/courses/GETcoursePlans.ts";
import { TanstackKeys } from "@/types/tanstack-keys";
import axios from "axios";
import { QueryConfig, useQueryCompat } from "@/lib/query-compat";

export default function useGETcoursePlans(
	params: GETcoursePlansParams,
	queryConfig?: QueryConfig<
		GETcoursePlans,
		Error,
		GETcoursePlans,
		string[]
	>,
) {
	return useQueryCompat({
        queryKey: [TanstackKeys.CoursePlans, ...getQueryKeysFromParamsObject(params)],

        queryFn: async () => {
			const res = await axios.get(
				GETcoursePlansApiUrl({
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
