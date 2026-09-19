import axios from "axios";
import { QueryConfig, useQueryCompat } from "@/lib/query-compat";
import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
	GETcourseFeatures,
	GETcourseFeaturesApiUrl,
	GETcourseFeaturesParams,
} from "@/types/api-types/course-features/GETcourseFeatures.ts";
import { TanstackKeys } from "@/types/tanstack-keys";

export default function useGETcourseFeatures(
	params: GETcourseFeaturesParams,
	queryConfig?: QueryConfig<
		GETcourseFeatures,
		Error,
		GETcourseFeatures,
		string[]
	>,
) {
	return useQueryCompat({
		queryKey: [
			TanstackKeys.CourseFeatures,
			...getQueryKeysFromParamsObject(params),
		],

		queryFn: async () => {
			const res = await axios.get(
				GETcourseFeaturesApiUrl({
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
