import axios from "axios";
import { QueryConfig, useQueryCompat } from "@/lib/query-compat";
import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
	GETcourseLastThreeUpdatedResources,
	GETcourseLastThreeUpdatedResourcesApiUrl,
	GETcourseLastThreeUpdatedResourcesParams,
} from "@/types/api-types/courses/GETcourseLastThreeUpdatedResources.ts";
import { TanstackKeys } from "@/types/tanstack-keys";

export default function useGETcourseLastThreeUpdatedResources(
	params: GETcourseLastThreeUpdatedResourcesParams,
	queryConfig?: QueryConfig<
		GETcourseLastThreeUpdatedResources,
		Error,
		GETcourseLastThreeUpdatedResources,
		string[]
	>,
) {
	return useQueryCompat({
		queryKey: [
			TanstackKeys.CourseFolderResources,
			...getQueryKeysFromParamsObject(params),
		],

		queryFn: async () => {
			const res = await axios.get(
				GETcourseLastThreeUpdatedResourcesApiUrl({
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
