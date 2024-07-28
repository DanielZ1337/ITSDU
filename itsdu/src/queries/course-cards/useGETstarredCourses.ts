import {
	useQuery,
	UseQueryOptions,
	useSuspenseQuery,
} from "@tanstack/react-query";
import axios from "axios";
import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
	GETstarredCourses,
	GETstarredCoursesApiUrl,
	GETstarredCoursesParams,
} from "@/types/api-types/course-cards/GETstarredCourses.ts";
import { TanstackKeys } from "@/types/tanstack-keys";

export default function useGETstarredCourses(
	params: GETstarredCoursesParams,
	queryConfig?: UseQueryOptions<
		GETstarredCourses,
		Error,
		GETstarredCourses,
		string[]
	>,
) {
	return useSuspenseQuery({
		queryKey: [
			TanstackKeys.StarredCourses,
			...getQueryKeysFromParamsObject(params),
		],
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
		...queryConfig,
	});
}
