import { useInfiniteQuery, UseInfiniteQueryOptions } from "@tanstack/react-query";
import axios from "axios";
import { getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
    GETinstantMessagesForThread,
    GETinstantMessagesForThreadApiUrl,
    GETinstantMessagesForThreadParams
} from "@/types/api-types/messages/GETinstantMessagesForThread.ts";

export default function useGETinstantMessagesForThread(params: GETinstantMessagesForThreadParams, queryConfig?: UseInfiniteQueryOptions<GETinstantMessagesForThread, Error, GETinstantMessagesForThread, GETinstantMessagesForThread, string[]>) {
    return useInfiniteQuery({
        queryKey: ['messagesv2', ...getQueryKeysFromParamsObject(params)], queryFn: async ({ pageParam }) => {
            console.log('useGETmessages')
            const res = await axios.get(GETinstantMessagesForThreadApiUrl({
                ...params,
                fromId: pageParam as number
            }), {
                params: {
                    "access_token": localStorage.getItem('access_token') || '',
                }
            });

            if (res.status !== 200) throw new Error(res.statusText);

            return res.data;
        },
        initialPageParam: params.fromId,
        ...queryConfig,
        getNextPageParam: (lastPage) => {

            const lowestId = lastPage.Messages.EntityArray.reduce((prev, curr) => {
                if (curr.MessageId < prev) {
                    return curr.MessageId;
                } else {
                    return prev;
                }
            }, Infinity);

            return lastPage.HasMore ? lowestId : undefined;
        },
    })
}