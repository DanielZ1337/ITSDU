import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
  PUTinstantMessageThreadApiUrl,
  PUTinstantMessageThreadBody,
  PUTinstantMessageThreadParams,
} from "@/types/api-types/messages/PUTinstantMessageThread.ts";
import { TanstackKeys } from "@/types/tanstack-keys";
import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import axios from "axios";

export default function usePUTinstantMessageThread(
  params: PUTinstantMessageThreadParams,
  queryConfig?: UseMutationOptions<
    undefined,
    Error,
    PUTinstantMessageThreadBody,
    string[]
  >,
) {
  return useMutation(
    [TanstackKeys.PUTinstantMessageThread, ...getQueryKeysFromParamsObject(params)],
    async (body) => {
      const res = await axios.put(PUTinstantMessageThreadApiUrl(params), body, {
        params: {
          access_token: await getAccessToken(),
        },
      });

      console.log(res);

      if (res.status !== 200) throw new Error(res.statusText);

      return res.data;
    },
    {
      ...queryConfig,
    },
  );
}
