import axios from "axios";
import { QueryConfig, useQueryCompat } from "@/lib/query-compat";
import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
	GETcalendarEvents,
	GETcalendarEventsParams,
	GETcalenderEventsApiUrl,
} from "@/types/api-types/calendar/GETcalendarEvents.ts";
import { TanstackKeys } from "@/types/tanstack-keys";

export default function useGETcalendarEvents(
	params: GETcalendarEventsParams,
	queryConfig?: QueryConfig<
		GETcalendarEvents,
		Error,
		GETcalendarEvents,
		string[]
	>,
) {
	return useQueryCompat({
		queryKey: [
			TanstackKeys.CalendarEvents,
			...getQueryKeysFromParamsObject(params),
		],

		queryFn: async () => {
			const res = await axios.get(
				GETcalenderEventsApiUrl({
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
