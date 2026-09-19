import axios from "axios";
import { QueryConfig, useQueryCompat } from "@/lib/query-compat";
import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
	GETcourseBasic,
	GETcourseBasicApiUrl,
	GETcourseBasicParams,
} from "@/types/api-types/courses/GETcourseBasic.ts";
import { TanstackKeys } from "@/types/tanstack-keys";

export default function useGETcourseBasic(
	params: GETcourseBasicParams,
	queryConfig?: QueryConfig<GETcourseBasic, Error, GETcourseBasic, string[]>,
) {
	return useQueryCompat({
		queryKey: [
			TanstackKeys.CourseBasic,
			...getQueryKeysFromParamsObject(params),
		],

		queryFn: async () => {
			const res = await axios.get(
				GETcourseBasicApiUrl({
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
