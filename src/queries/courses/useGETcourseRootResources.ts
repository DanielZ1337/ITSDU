import axios from "axios";
import { QueryConfig, useQueryCompat } from "@/lib/query-compat";
import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
	GETcourseRootResources,
	GETcourseRootResourcesApiUrl,
	GETcourseRootResourcesParams,
} from "@/types/api-types/courses/GETcourseRootResources.ts";
import { TanstackKeys } from "@/types/tanstack-keys";

export default function useGETcourseRootResources(
	params: GETcourseRootResourcesParams,
	queryConfig?: QueryConfig<
		GETcourseRootResources,
		Error,
		GETcourseRootResources,
		string[]
	>,
) {
	return useQueryCompat({
		queryKey: [
			TanstackKeys.CourseRootResources,
			...getQueryKeysFromParamsObject(params),
		],

		queryFn: async () => {
			const res = await axios.get(
				GETcourseRootResourcesApiUrl({
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
