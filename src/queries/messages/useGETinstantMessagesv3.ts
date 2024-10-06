import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
  GETinstantMessagesv3,
  GETinstantMessagesv3ApiUrl,
  GETinstantMessagesv3Params,
} from "@/types/api-types/messages/GETinstantMessagesv3.ts";
import { TanstackKeys } from "@/types/tanstack-keys";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function useGETinstantMessagesv3(
  params: GETinstantMessagesv3Params,
  queryConfig?: UseQueryOptions<
    GETinstantMessagesv3,
    Error,
    GETinstantMessagesv3,
    string[]
  >,
) {
  return useQuery(
    [TanstackKeys.Messagesv3, ...getQueryKeysFromParamsObject(params)],
    async () => {
      console.log("useGETmessages");
      const res = await axios.get(GETinstantMessagesv3ApiUrl(params), {
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
