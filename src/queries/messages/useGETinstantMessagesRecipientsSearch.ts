import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";
import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
    GETinstantMessagesRecipientsSearch,
    GETinstantMessagesRecipientsSearchApiUrl,
    GETinstantMessagesRecipientsSearchParams
} from "@/types/api-types/messages/GETinstantMessagesRecipientsSearch.ts";
import { TanstackKeys } from "@/types/tanstack-keys";

export default function useGETinstantMessagesRecipientsSearch(params: GETinstantMessagesRecipientsSearchParams, queryConfig?: UseQueryOptions<GETinstantMessagesRecipientsSearch, Error, GETinstantMessagesRecipientsSearch, string[]>) {

    return useQuery([TanstackKeys.MessagesRecipientsSearch, ...getQueryKeysFromParamsObject(params)], async () => {
        console.log('useGETinstantMessagesRecipientsSearch')
        const res = await axios.get(GETinstantMessagesRecipientsSearchApiUrl(params), {
            params: {
                "access_token": await getAccessToken() || '',
            }
        });

        if (res.status !== 200) throw new Error(res.statusText);

        return res.data;
    }, {
        ...queryConfig
    })
}