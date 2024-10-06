import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
	GETcourseCalenderEvents,
	GETcourseCalenderEventsApiUrl,
	GETcourseCalenderEventsParams,
} from "@/types/api-types/courses/GETcourseCalenderEvents.ts";
import { TanstackKeys } from "@/types/tanstack-keys";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function useGETcourseCalendarEvents(
	params: GETcourseCalenderEventsParams,
	queryConfig?: UseQueryOptions<
		GETcourseCalenderEvents,
		Error,
		GETcourseCalenderEvents,
		string[]
	>,
) {
	return useQuery(
		[
			TanstackKeys.CourseCalendarEvents,
			...getQueryKeysFromParamsObject(params),
		],
		async () => {
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
		{
			...queryConfig,
		},
	);
}
