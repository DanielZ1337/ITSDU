import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
  GETcalendarEvents,
  GETcalendarEventsParams,
  GETcalenderEventsApiUrl,
} from "@/types/api-types/calendar/GETcalendarEvents.ts";
import { TanstackKeys } from "@/types/tanstack-keys";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function useGETcalendarEvents(
  params: GETcalendarEventsParams,
  queryConfig?: UseQueryOptions<GETcalendarEvents, Error, GETcalendarEvents, string[]>,
) {
  return useQuery(
    [TanstackKeys.CalendarEvents, ...getQueryKeysFromParamsObject(params)],
    async () => {
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
    {
      ...queryConfig,
    },
  );
}
