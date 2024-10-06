import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
	GETcourseResourceInfo,
	GETcourseResourceInfoApiUrl,
	GETcourseResourceInfoParams,
} from "@/types/api-types/courses/GETcourseResourceInfo.ts";
import { TanstackKeys } from "@/types/tanstack-keys";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function useGETcourseResourceInfo(
	params: GETcourseResourceInfoParams,
	queryConfig?: UseQueryOptions<
		GETcourseResourceInfo,
		Error,
		GETcourseResourceInfo,
		string[]
	>,
) {
	return useQuery(
		[TanstackKeys.CourseResourceInfo, ...getQueryKeysFromParamsObject(params)],
		async () => {
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
		{
			...queryConfig,
		},
	);
}
