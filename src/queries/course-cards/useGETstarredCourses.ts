import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
	GETstarredCourses,
	GETstarredCoursesApiUrl,
	GETstarredCoursesParams,
} from "@/types/api-types/course-cards/GETstarredCourses.ts";
import { TanstackKeys } from "@/types/tanstack-keys";
import axios from "axios";
import { QueryConfig, useQueryCompat } from "@/lib/query-compat";

export default function useGETstarredCourses(
	params: GETstarredCoursesParams,
	queryConfig?: QueryConfig<
		GETstarredCourses,
		Error,
		GETstarredCourses,
		string[]
	>,
) {
	return useQueryCompat({
        queryKey: [TanstackKeys.StarredCourses, ...getQueryKeysFromParamsObject(params)],

        queryFn: async () => {
			const res = await axios.get(
				GETstarredCoursesApiUrl({
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

        suspense: true,
        ...queryConfig
    });
}
