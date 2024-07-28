import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";
import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
  GETcourseBasic,
  GETcourseBasicApiUrl,
  GETcourseBasicParams,
} from "@/types/api-types/courses/GETcourseBasic.ts";
import { TanstackKeys } from "@/types/tanstack-keys";

export default function useGETcourseBasic(
  params: GETcourseBasicParams,
  queryConfig?: UseQueryOptions<GETcourseBasic, Error, GETcourseBasic, string[]>
) {
  return useQuery({
    queryKey: [
      TanstackKeys.CourseBasic,
      ...getQueryKeysFromParamsObject(params),
    ],
    queryFn: async () => {
      const res = await axios.get(
        GETcourseBasicApiUrl({
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
