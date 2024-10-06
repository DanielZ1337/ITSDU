import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
	GETcourseBasic,
	GETcourseBasicApiUrl,
	GETcourseBasicParams,
} from "@/types/api-types/courses/GETcourseBasic.ts";
import { TanstackKeys } from "@/types/tanstack-keys";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function useGETcourseBasic(
	params: GETcourseBasicParams,
	queryConfig?: UseQueryOptions<
		GETcourseBasic,
		Error,
		GETcourseBasic,
		string[]
	>,
) {
	return useQuery(
		[TanstackKeys.CourseBasic, ...getQueryKeysFromParamsObject(params)],
		async () => {
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
		{
			...queryConfig,
		},
	);
}
