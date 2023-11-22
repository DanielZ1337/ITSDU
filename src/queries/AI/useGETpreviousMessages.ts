import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";
import { getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import { GETpreviousMessagesApiUrl } from "@/types/api-types/AI/GETpreviousMessages.ts";
import { TanstackKeys } from '../../types/tanstack-keys';
import { useUser } from "@/hooks/atoms/useUser";
import { GETpreviousMessagesResponse } from '../../types/api-types/AI/GETpreviousMessages';

export default function useGETpreviousMessages(elementId: number | string, queryConfig?: UseQueryOptions<GETpreviousMessagesResponse, Error, GETpreviousMessagesResponse, string[]>) {
    const user = useUser()


    return useQuery([TanstackKeys.AIpreviousMessages, ...getQueryKeysFromParamsObject({ elementId })], async () => {

        if (!user) throw new Error("User not found")

        const previousMessages = await axios.get(GETpreviousMessagesApiUrl({
            elementId: Number(elementId),
            userId: user.PersonId
        }), {
            params: {
                elementId,
                userId: user.PersonId
            }
        });

        return previousMessages.data;

    }, {
        ...queryConfig
    })
}