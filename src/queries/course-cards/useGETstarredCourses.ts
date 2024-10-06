import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
  GETstarredCourses,
  GETstarredCoursesApiUrl,
  GETstarredCoursesParams,
} from "@/types/api-types/course-cards/GETstarredCourses.ts";
import { TanstackKeys } from "@/types/tanstack-keys";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function useGETstarredCourses(
  params: GETstarredCoursesParams,
  queryConfig?: UseQueryOptions<GETstarredCourses, Error, GETstarredCourses, string[]>,
) {
  return useQuery(
    [TanstackKeys.StarredCourses, ...getQueryKeysFromParamsObject(params)],
    async () => {
      const res = await axios.get(
        GETstarredCoursesApiUrl({
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
      suspense: true,
      ...queryConfig,
    },
  );
}
