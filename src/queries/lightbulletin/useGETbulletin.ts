import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
  GETbulletin,
  GETbulletinApiUrl,
  GETbulletinParams,
} from "@/types/api-types/lightbulletin/GETbulletin.ts";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { TanstackKeys } from "../../types/tanstack-keys";

export default function useGETbulletin(
  params: GETbulletinParams,
  queryConfig?: UseQueryOptions<GETbulletin, Error, GETbulletin, string[]>,
) {
  return useQuery(
    [TanstackKeys.Bulletin, ...getQueryKeysFromParamsObject(params)],
    async () => {
      const res = await axios.get(
        GETbulletinApiUrl({
          ...params,
        }),
        {
          params: {
            access_token: (await getAccessToken()) || "",
            ...params,
          },
        },
      );

      if (res.status !== 200) throw new Error(res.statusText);

      return res.data;
    },
    {
      ...queryConfig,
    },
  );
}
