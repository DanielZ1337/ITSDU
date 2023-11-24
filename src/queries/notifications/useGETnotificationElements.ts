import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";
import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
    GETnotificationElements,
    GETnotificationElementsApiUrl,
    GETnotificationElementsParams
} from "@/types/api-types/notifications/GETnotificationElements";
import { TanstackKeys } from '../../types/tanstack-keys';

export default function useGETnotificationElements(params: GETnotificationElementsParams, queryConfig?: UseQueryOptions<GETnotificationElements, Error, GETnotificationElements, string[]>) {

    return useQuery([TanstackKeys.NotificationElements, ...getQueryKeysFromParamsObject(params)], async () => {
        const res = await axios.get(GETnotificationElementsApiUrl({
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