import {useInfiniteQuery, UseInfiniteQueryOptions} from "@tanstack/react-query";
import axios from "axios";
import {getAccessToken, getQueryKeysFromParamsObject} from "@/lib/utils.ts";
import {
    GETinstantMessagesv2,
    GETinstantMessagesv2ApiUrl,
    GETinstantMessagesv2Params
} from "@/types/api-types/messages/GETinstantMessagesv2.ts";
import {TanstackKeys} from "@/types/tanstack-keys";

export default function useGETinstantMessagesv2(params: GETinstantMessagesv2Params, queryConfig?: UseInfiniteQueryOptions<GETinstantMessagesv2, Error, GETinstantMessagesv2, GETinstantMessagesv2, string[]>) {
    return useInfiniteQuery([TanstackKeys.Messagesv2, ...getQueryKeysFromParamsObject(params)], async ({pageParam = params.threadPage}) => {
        console.log('useGETmessages')
        const res = await axios.get(GETinstantMessagesv2ApiUrl({
            ...params,
            threadPage: pageParam
        }), {
            params: {
                "access_token": await getAccessToken() || '',
            }
        });

        if (res.status !== 200) throw new Error(res.statusText);

        return res.data;
    }, {
        ...queryConfig,
        getNextPageParam: (lastPage) => {
            if ((lastPage.CurrentPageIndex + 1) * lastPage.PageSize < lastPage.Total) {
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