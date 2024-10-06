import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
  GETcoursePlansWithoutDate,
  GETcoursePlansWithoutDateApiUrl,
  GETcoursePlansWithoutDateParams,
} from "@/types/api-types/courses/GETcoursePlansWithoutDate.ts";
import { TanstackKeys } from "@/types/tanstack-keys";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function useGETcoursePlansWithoutDate(
  params: GETcoursePlansWithoutDateParams,
  queryConfig?: UseQueryOptions<
    GETcoursePlansWithoutDate,
    Error,
    GETcoursePlansWithoutDate,
    string[]
  >,
) {
  return useQuery(
    [TanstackKeys.CoursePlansWithoutDate, ...getQueryKeysFromParamsObject(params)],
    async () => {
      const res = await axios.get(
        GETcoursePlansWithoutDateApiUrl({
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
