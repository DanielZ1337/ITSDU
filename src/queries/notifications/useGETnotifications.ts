import { useInfiniteQuery, UseInfiniteQueryOptions } from "@tanstack/react-query";
import axios from "axios";
import { getQueryKeysFromParamsObject } from "@/lib/utils";
import {
    GETnotifications,
    GETnotificationsApiUrl,
    GETnotificationsParams
} from '@/types/api-types/notifications/GETnotifications';

export default function useGETnotifications(params: GETnotificationsParams, queryConfig?: UseInfiniteQueryOptions<GETnotifications, Error, GETnotifications, GETnotifications, string[]>) {

    return useInfiniteQuery({
        queryKey: ['notifications', ...getQueryKeysFromParamsObject(params)], queryFn: async ({ pageParam }) => {
            const res = await axios.get(GETnotificationsApiUrl({
                ...params,
                PageIndex: pageParam as number
            }), {
                params: {
                    "access_token": localStorage.getItem('access_token') || '',
                },
            });

            if (res.status !== 200) throw new Error(res.statusText);

            return res.data;
        },
        getNextPageParam: (lastPage) => {
            console.log(lastPage.PageSize, lastPage.Total, lastPage.CurrentPageIndex, lastPage.CurrentPageIndex * lastPage.PageSize < lastPage.Total)
            if (lastPage.CurrentPageIndex * lastPage.PageSize < lastPage.Total) {
                return lastPage.CurrentPageIndex + 1;
            } else {
                return undefined;
            }
        },
        getPreviousPageParam: (firstPage) => {
            if (firstPage.CurrentPageIndex > 0) {
                return firstPage.CurrentPageIndex - 1;
            } else {
                return undefined;
            }
        },
        initialPageParam: params.PageIndex,
        ...queryConfig
    })
}