import axios from "axios";
import { QueryConfig, useQueryCompat } from "@/lib/query-compat";
import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
	GETcourseResourcesBySearch,
	GETcourseResourcesBySearchApiUrl,
	GETcourseResourcesBySearchParams,
} from "@/types/api-types/courses/GETcourseResourcesBySearch.ts";
import { TanstackKeys } from "@/types/tanstack-keys";

export default function useGETcourseResourceBySearch(
	params: GETcourseResourcesBySearchParams,
	queryConfig?: QueryConfig<
		GETcourseResourcesBySearch,
		Error,
		GETcourseResourcesBySearch,
		string[]
	>,
) {
	return useQueryCompat({
		queryKey: [
			TanstackKeys.CourseResourcesBySearch,
			...getQueryKeysFromParamsObject(params),
		],

		queryFn: async () => {
			const res = await axios.get(
				GETcourseResourcesBySearchApiUrl({
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
