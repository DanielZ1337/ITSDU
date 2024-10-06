import { useUser } from "@/hooks/atoms/useUser";
import { getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
  GETpreviousChatsApiUrl,
  GETpreviousChatsParams,
  GETpreviousChatsResponse,
} from "@/types/api-types/AI/GETpreviousChats.ts";
import { UseInfiniteQueryOptions, useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { TanstackKeys } from "../../types/tanstack-keys";

export default function useGETpreviousChats(
  params?: Omit<GETpreviousChatsParams, "userId">,
  queryConfig?: UseInfiniteQueryOptions<
    GETpreviousChatsResponse,
    Error,
    GETpreviousChatsResponse,
    GETpreviousChatsResponse,
    string[]
  >,
) {
  const user = useUser();

  return useInfiniteQuery(
    [TanstackKeys.AIpreviousMessages, ...getQueryKeysFromParamsObject(params ?? {})],
    async ({ pageParam = params?.pageIndex }) => {
      if (!user) throw new Error("User not found");

      const previousMessages = await axios.get(
        GETpreviousChatsApiUrl({
          userId: user.PersonId,
          pageIndex: pageParam,
        }),
        {
          params: {
            userId: user.PersonId,
          },
        },
      );

      return previousMessages.data;
    },
    {
      ...queryConfig,
      getNextPageParam: (lastPage) => {
        const { totalFiles, pageSize, pageIndex } = lastPage;
        const parsedTotalMessages = Number(totalFiles);
        const parsedPageSize = Number(pageSize);
        const parsedPageIndex = Number(pageIndex);
        if (parsedTotalMessages > parsedPageSize * parsedPageIndex) {
          return parsedPageIndex + 1;
        } else {
          return undefined;
        }
      },
    },
  );
}
