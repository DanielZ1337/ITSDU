import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
	GETcalenderEvent,
	GETcalenderEventApiUrl,
	GETcalenderEventParams,
} from "@/types/api-types/calendar/GETcalenderEvent.ts";
import { TanstackKeys } from "@/types/tanstack-keys";
import axios from "axios";
import { QueryConfig, useQueryCompat } from "@/lib/query-compat";

export default function useGETcalendarEvent(
	params: GETcalenderEventParams,
	queryConfig?: QueryConfig<
		GETcalenderEvent,
		Error,
		GETcalenderEvent,
		string[]
	>,
) {
	return useQueryCompat({
        queryKey: [TanstackKeys.CalendarEvent, ...getQueryKeysFromParamsObject(params)],

        queryFn: async () => {
			const res = await axios.get(
				GETcalenderEventApiUrl({
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
