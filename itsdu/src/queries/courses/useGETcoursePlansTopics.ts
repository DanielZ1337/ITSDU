import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";
import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
  GETcoursePlansTopics,
  GETcoursePlansTopicsApiUrl,
  GETcoursePlansTopicsParams,
} from "@/types/api-types/courses/GETcoursePlansTopics.ts";
import { TanstackKeys } from "@/types/tanstack-keys";

export default function useGETcoursePlansTopics(
  params: GETcoursePlansTopicsParams,
  queryConfig?: UseQueryOptions<
    GETcoursePlansTopics,
    Error,
    GETcoursePlansTopics,
    string[]
  >
) {
  return useQuery({
    queryKey: [
      TanstackKeys.CoursePlansTopics,
      ...getQueryKeysFromParamsObject(params),
    ],
    queryFn: async () => {
      const res = await axios.get(
        GETcoursePlansTopicsApiUrl({
          ...params,
        }),
        {
          params: {
            access_token: (await getAccessToken()) || "",
            ...params,
          },
        }
      );

      if (res.status !== 200) throw new Error(res.statusText);

      return res.data;
    },
    ...queryConfig,
  });
}
