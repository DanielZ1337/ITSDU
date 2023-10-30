import {
    GETcalenderEvent,
    GETcalenderEventApiUrl,
    GETcalenderEventParams
} from "@/types/api-types/calendar/GETcalenderEvent.ts";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";
import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import { TanstackKeys } from "@/types/tanstack-keys";

export default function useGETcalendarEvent(params: GETcalenderEventParams, queryConfig?: UseQueryOptions<GETcalenderEvent, Error, GETcalenderEvent, string[]>) {

    return useQuery([TanstackKeys.CalendarEvent, ...getQueryKeysFromParamsObject(params)], async () => {
        const res = await axios.get(GETcalenderEventApiUrl({
            ...params
        }), {
            params: {
                "access_token": await getAccessToken() || '',
                ...params,
            }
        });

        if (res.status !== 200) throw new Error(res.statusText);

        return res.data;
    }, {
        ...queryConfig
    })
}