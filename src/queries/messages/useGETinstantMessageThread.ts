import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
  GETinstantMessageThread,
  GETinstantMessageThreadApiUrl,
  GETinstantMessageThreadParams,
} from "@/types/api-types/messages/GETinstantMessageThread.ts";
import { TanstackKeys } from "@/types/tanstack-keys";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function useGETinstantMessageThread(
  params: GETinstantMessageThreadParams,
  queryConfig?: UseQueryOptions<
    GETinstantMessageThread,
    Error,
    GETinstantMessageThread,
    string[]
  >,
) {
  return useQuery(
    [TanstackKeys.MessageThread, ...getQueryKeysFromParamsObject(params)],
    async () => {
      const res = await axios.get(GETinstantMessageThreadApiUrl(params), {
        params: {
          access_token: (await getAccessToken()) || "",
        },
      });

      if (res.status !== 200) throw new Error(res.statusText);

      return res.data;
    },
    {
      ...queryConfig,
    },
  );
}
