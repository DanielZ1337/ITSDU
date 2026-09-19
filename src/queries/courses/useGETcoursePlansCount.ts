import axios from "axios";
import { QueryConfig, useQueryCompat } from "@/lib/query-compat";
import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
	GETcoursePlansCount,
	GETcoursePlansCountApiUrl,
	GETcoursePlansCountParams,
} from "@/types/api-types/courses/GETcoursePlansCount.ts";
import { TanstackKeys } from "@/types/tanstack-keys";

export default function useGETcoursePlansCount(
	params: GETcoursePlansCountParams,
	queryConfig?: QueryConfig<
		GETcoursePlansCount,
		Error,
		GETcoursePlansCount,
		string[]
	>,
) {
	return useQueryCompat({
		queryKey: [
			TanstackKeys.CoursePlansCount,
			...getQueryKeysFromParamsObject(params),
		],

		queryFn: async () => {
			const res = await axios.get(
				GETcoursePlansCountApiUrl({
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
