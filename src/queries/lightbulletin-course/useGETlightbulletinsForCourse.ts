import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
	GETlightbulletinsForCourse,
	GETlightbulletinsForCourseApiUrl,
	GETlightbulletinsForCourseParams,
} from "@/types/api-types/lightbulletin-course/GETlightbulletinsForCourse.ts";
import { TanstackKeys } from "@/types/tanstack-keys";
import axios from "axios";
import { QueryConfig, useQueryCompat } from "@/lib/query-compat";

export default function useGETlightbulletinsForCourse(
	params: GETlightbulletinsForCourseParams,
	queryConfig?: QueryConfig<
		GETlightbulletinsForCourse,
		Error,
		GETlightbulletinsForCourse,
		string[]
	>,
) {
	return useQueryCompat({
        queryKey: [
			TanstackKeys.LightbulletinsForCourse,
			...getQueryKeysFromParamsObject(params),
		],

        queryFn: async () => {
			const res = await axios.get(
				GETlightbulletinsForCourseApiUrl({
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

        ...queryConfig
    });
}
