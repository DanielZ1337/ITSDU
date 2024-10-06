import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
  GETcoursePlansPast,
  GETcoursePlansPastApiUrl,
  GETcoursePlansPastParams,
} from "@/types/api-types/courses/GETcoursePlansPast.ts";
import { TanstackKeys } from "@/types/tanstack-keys";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function useGETcoursePlansPast(
  params: GETcoursePlansPastParams,
  queryConfig?: UseQueryOptions<GETcoursePlansPast, Error, GETcoursePlansPast, string[]>,
) {
  return useQuery(
    [TanstackKeys.CoursePlansPast, ...getQueryKeysFromParamsObject(params)],
    async () => {
      const res = await axios.get(
        GETcoursePlansPastApiUrl({
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
