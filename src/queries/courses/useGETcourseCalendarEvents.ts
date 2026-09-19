import axios from "axios";
import { QueryConfig, useQueryCompat } from "@/lib/query-compat";
import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
	GETcourseCalenderEvents,
	GETcourseCalenderEventsApiUrl,
	GETcourseCalenderEventsParams,
} from "@/types/api-types/courses/GETcourseCalenderEvents.ts";
import { TanstackKeys } from "@/types/tanstack-keys";

export default function useGETcourseCalendarEvents(
	params: GETcourseCalenderEventsParams,
	queryConfig?: QueryConfig<
		GETcourseCalenderEvents,
		Error,
		GETcourseCalenderEvents,
		string[]
	>,
) {
	return useQueryCompat({
		queryKey: [
			TanstackKeys.CourseCalendarEvents,
			...getQueryKeysFromParamsObject(params),
		],

		queryFn: async () => {
			const res = await axios.get(
				GETcourseCalenderEventsApiUrl({
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
