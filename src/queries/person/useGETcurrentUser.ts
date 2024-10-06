import { getAccessToken } from "@/lib/utils";
import {
  GETcurrentUser,
  GETcurrentUserApiUrl,
} from "@/types/api-types/person/GETcurrentUser.ts";
import { TanstackKeys } from "@/types/tanstack-keys";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import axios from "axios";

export default async function useGETcurrentUser(
  queryConfig?: UseQueryOptions<GETcurrentUser, Error, GETcurrentUser, string[]>,
) {
  const access_token = await getAccessToken();

  return useQuery(
    [TanstackKeys.CurrentUser, access_token],
    async () => {
      const res = await axios.get(GETcurrentUserApiUrl(), {
        params: {
          access_token: await getAccessToken(),
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
