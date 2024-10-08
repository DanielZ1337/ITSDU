import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
	GETlightbulletinsForCourse,
	GETlightbulletinsForCourseApiUrl,
	GETlightbulletinsForCourseParams,
} from "@/types/api-types/lightbulletin-course/GETlightbulletinsForCourse.ts";
import { TanstackKeys } from "@/types/tanstack-keys";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function useGETlightbulletinsForCourse(
	params: GETlightbulletinsForCourseParams,
	queryConfig?: UseQueryOptions<
		GETlightbulletinsForCourse,
		Error,
		GETlightbulletinsForCourse,
		string[]
	>,
) {
	return useQuery(
		[
			TanstackKeys.LightbulletinsForCourse,
			...getQueryKeysFromParamsObject(params),
		],
		async () => {
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
		{
			...queryConfig,
		},
	);
}
