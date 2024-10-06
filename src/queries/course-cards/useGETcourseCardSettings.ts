import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
	GETcourseCardSettings,
	GETcourseCardSettingsApiUrl,
	GETcourseCardSettingsParams,
} from "@/types/api-types/course-cards/GETcourseCardSettings.ts";
import { TanstackKeys } from "@/types/tanstack-keys";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function useGETcourseCardSettings(
	params: GETcourseCardSettingsParams,
	queryConfig?: UseQueryOptions<
		GETcourseCardSettings,
		Error,
		GETcourseCardSettings,
		string[]
	>,
) {
	return useQuery(
		[TanstackKeys.CourseCardSettings, ...getQueryKeysFromParamsObject(params)],
		async () => {
			const res = await axios.get(
				GETcourseCardSettingsApiUrl({
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
