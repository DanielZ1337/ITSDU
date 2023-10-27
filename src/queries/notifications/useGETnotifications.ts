import { useInfiniteQuery, UseInfiniteQueryOptions } from "@tanstack/react-query";
import axios from "axios";
import { getQueryKeysFromParamsObject } from "@/lib/utils";
import {
    GETnotifications,
    GETnotificationsApiUrl,
    GETnotificationsParams
} from '@/types/api-types/notifications/GETnotifications';

export default function useGETnotifications(params: GETnotificationsParams, queryConfig?: UseInfiniteQueryOptions<GETnotifications, Error, GETnotifications, GETnotifications, string[]>) {

    return useInfiniteQuery(['notifications', ...getQueryKeysFromParamsObject(params)], async ({ pageParam = params.PageIndex }) => {
        const res = await axios.get(GETnotificationsApiUrl({
            ...params,
            PageIndex: pageParam
        }), {
            params: {
                "access_token": localStorage.getItem('access_token') || '',
            },
        });

        if (res.status !== 200) throw new Error(res.statusText);

        return res.data;
    }, {
        ...queryConfig,
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
        }
    })
}