import axios from "axios";
import { QueryConfig, useQueryCompat } from "@/lib/query-compat";
import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
	GETcoursePlansWithoutDate,
	GETcoursePlansWithoutDateApiUrl,
	GETcoursePlansWithoutDateParams,
} from "@/types/api-types/courses/GETcoursePlansWithoutDate.ts";
import { TanstackKeys } from "@/types/tanstack-keys";

export default function useGETcoursePlansWithoutDate(
	params: GETcoursePlansWithoutDateParams,
	queryConfig?: QueryConfig<
		GETcoursePlansWithoutDate,
		Error,
		GETcoursePlansWithoutDate,
		string[]
	>,
) {
	return useQueryCompat({
		queryKey: [
			TanstackKeys.CoursePlansWithoutDate,
			...getQueryKeysFromParamsObject(params),
		],

		queryFn: async () => {
			const res = await axios.get(
				GETcoursePlansWithoutDateApiUrl({
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
