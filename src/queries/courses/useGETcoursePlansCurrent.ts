import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
  GETcoursePlansCurrent,
  GETcoursePlansCurrentApiUrl,
  GETcoursePlansCurrentParams,
} from "@/types/api-types/courses/GETcoursePlansCurrent.ts";
import { TanstackKeys } from "@/types/tanstack-keys";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function useGETcoursePlansCurrent(
  params: GETcoursePlansCurrentParams,
  queryConfig?: UseQueryOptions<
    GETcoursePlansCurrent,
    Error,
    GETcoursePlansCurrent,
    string[]
  >,
) {
  return useQuery(
    [TanstackKeys.CoursePlansCurrent, ...getQueryKeysFromParamsObject(params)],
    async () => {
      const res = await axios.get(
        GETcoursePlansCurrentApiUrl({
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
