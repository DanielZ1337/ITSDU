import {useQuery, UseQueryOptions} from "@tanstack/react-query";
import axios from "axios";
import {getQueryKeysFromParamsObject} from "@/lib/utils";
import {
    GETnotifications,
    GETnotificationsApiUrl,
    GETnotificationsParams
} from '@/types/api-types/notifications/GETnotifications';

export default function useGETnotifications(params: GETnotificationsParams, queryConfig?: UseQueryOptions<GETnotificationsParams, Error, GETnotifications, string[]>) {

    return useQuery(['notifications', ...getQueryKeysFromParamsObject(params)], async () => {
        const res = await axios.get(GETnotificationsApiUrl(params), {
            params: {
                "access_token": localStorage.getItem('access_token') || '',
            },
        });

        if (res.status !== 200) throw new Error(res.statusText);

        return res.data;
    }, {
        ...queryConfig
    })
}