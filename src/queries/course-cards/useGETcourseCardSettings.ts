import axios from "axios";
import { QueryConfig, useQueryCompat } from "@/lib/query-compat";
import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
	GETcourseCardSettings,
	GETcourseCardSettingsApiUrl,
	GETcourseCardSettingsParams,
} from "@/types/api-types/course-cards/GETcourseCardSettings.ts";
import { TanstackKeys } from "@/types/tanstack-keys";

export default function useGETcourseCardSettings(
	params: GETcourseCardSettingsParams,
	queryConfig?: QueryConfig<
		GETcourseCardSettings,
		Error,
		GETcourseCardSettings,
		string[]
	>,
) {
	return useQueryCompat({
		queryKey: [
			TanstackKeys.CourseCardSettings,
			...getQueryKeysFromParamsObject(params),
		],

		queryFn: async () => {
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

		...queryConfig,
	});
}
