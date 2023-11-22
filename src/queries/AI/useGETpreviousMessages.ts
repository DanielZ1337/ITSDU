import { useInfiniteQuery, UseInfiniteQueryOptions, useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";
import { getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import { GETpreviousMessagesApiUrl, GETpreviousMessagesParams } from "@/types/api-types/AI/GETpreviousMessages.ts";
import { TanstackKeys } from '../../types/tanstack-keys';
import { useUser } from "@/hooks/atoms/useUser";
import { GETpreviousMessagesResponse } from '../../types/api-types/AI/GETpreviousMessages';

export default function useGETpreviousMessages(params: Omit<GETpreviousMessagesParams, "userId">, queryConfig?: UseInfiniteQueryOptions<GETpreviousMessagesResponse, Error, GETpreviousMessagesResponse, GETpreviousMessagesResponse, string[]>) {
    const user = useUser()

    return useInfiniteQuery([TanstackKeys.AIpreviousMessages, ...getQueryKeysFromParamsObject(params)], async ({ pageParam = params.pageIndex }) => {
        if (!user) throw new Error("User not found")

        const { elementId } = params;

        const previousMessages = await axios.get(GETpreviousMessagesApiUrl({
            elementId: Number(elementId),
            userId: user.PersonId,
            pageIndex: pageParam
        }), {
            params: {
                elementId,
                userId: user.PersonId
            }
        });

        return previousMessages.data;

    }, {
        ...queryConfig,
        getNextPageParam: (lastPage) => {
            if (lastPage.pageIndex * lastPage.pageSize < lastPage.totalMessages) {
                return lastPage.pageIndex + 1;
            } else {
                return undefined;
            }
        }
    })
}