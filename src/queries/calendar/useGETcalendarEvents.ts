import {useQuery, UseQueryOptions} from "@tanstack/react-query";
import axios from "axios";
import {
    GETcalendarEvents,
    GETcalendarEventsParams,
    GETcalenderEventsApiUrl
} from "@/api-types/calendar/GETcalendarEvents.ts";
import {getQueryKeysFromParamsObject} from "@/lib/utils.ts";

export default function useGETcalendarEvents(params: GETcalendarEventsParams, queryConfig?: UseQueryOptions<GETcalendarEvents, Error, GETcalendarEvents, string[]>) {
    return useQuery(['calendarEvents', ...getQueryKeysFromParamsObject(params)], async () => {
        const res = await axios.get(GETcalenderEventsApiUrl({
            ...params
        }), {
            params: {
                "access_token": localStorage.getItem('access_token') || '',
                ...params,
            }
        });

        if (res.status !== 200) throw new Error(res.statusText);

        return res.data;
    }, {
        ...queryConfig
    })
}