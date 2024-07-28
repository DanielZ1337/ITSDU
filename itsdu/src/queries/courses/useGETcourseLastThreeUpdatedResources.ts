import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";
import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
	GETcourseLastThreeUpdatedResources,
	GETcourseLastThreeUpdatedResourcesApiUrl,
	GETcourseLastThreeUpdatedResourcesParams,
} from "@/types/api-types/courses/GETcourseLastThreeUpdatedResources.ts";
import { TanstackKeys } from "@/types/tanstack-keys";

export default function useGETcourseLastThreeUpdatedResources(
	params: GETcourseLastThreeUpdatedResourcesParams,
	queryConfig?: UseQueryOptions<
		GETcourseLastThreeUpdatedResources,
		Error,
		GETcourseLastThreeUpdatedResources,
		string[]
	>,
) {
	return useQuery(
		[
			TanstackKeys.CourseFolderResources,
			...getQueryKeysFromParamsObject(params),
		],
		async () => {
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
		{
			...queryConfig,
		},
	);
}
