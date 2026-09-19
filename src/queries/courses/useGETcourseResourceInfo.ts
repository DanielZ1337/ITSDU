import axios from "axios";
import { QueryConfig, useQueryCompat } from "@/lib/query-compat";
import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
	GETcourseResourceInfo,
	GETcourseResourceInfoApiUrl,
	GETcourseResourceInfoParams,
} from "@/types/api-types/courses/GETcourseResourceInfo.ts";
import { TanstackKeys } from "@/types/tanstack-keys";

export default function useGETcourseResourceInfo(
	params: GETcourseResourceInfoParams,
	queryConfig?: QueryConfig<
		GETcourseResourceInfo,
		Error,
		GETcourseResourceInfo,
		string[]
	>,
) {
	return useQueryCompat({
		queryKey: [
			TanstackKeys.CourseResourceInfo,
			...getQueryKeysFromParamsObject(params),
		],

		queryFn: async () => {
			const res = await axios.get(
				GETcourseResourceInfoApiUrl({
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
