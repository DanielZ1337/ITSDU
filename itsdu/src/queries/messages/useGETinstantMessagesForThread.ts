import {
  useInfiniteQuery,
  UseInfiniteQueryOptions,
} from "@tanstack/react-query";
import axios from "axios";
import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
  GETinstantMessagesForThread,
  GETinstantMessagesForThreadApiUrl,
  GETinstantMessagesForThreadParams,
} from "@/types/api-types/messages/GETinstantMessagesForThread.ts";
import { TanstackKeys } from "@/types/tanstack-keys";

export default function useGETinstantMessagesForThread(
  params: GETinstantMessagesForThreadParams,
  queryConfig?: UseInfiniteQueryOptions<
    GETinstantMessagesForThread,
    Error,
    GETinstantMessagesForThread,
    GETinstantMessagesForThread,
    string[]
  >
) {
  return useInfiniteQuery({
    queryKey: [
      TanstackKeys.Messagesv2,
      ...getQueryKeysFromParamsObject(params),
    ],
    queryFn: async ({ pageParam = params.fromId }) => {
      console.log("useGETmessages");
      const res = await axios.get(
        GETinstantMessagesForThreadApiUrl({
          ...params,
          fromId: pageParam,
        }),
        {
          params: {
            access_token: (await getAccessToken()) || "",
          },
        }
      );

      if (res.status !== 200) throw new Error(res.statusText);

      return res.data;
    },
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
  });
}
