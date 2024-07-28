import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";
import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
  GETcoursesv3,
  GETcoursesv3ApiUrl,
  GETcoursesv3Params,
} from "@/types/api-types/courses/GETcoursesv3.ts";
import { TanstackKeys } from "@/types/tanstack-keys";

export default function useGETcoursesv3(
  params: GETcoursesv3Params,
  queryConfig?: UseQueryOptions<GETcoursesv3, Error, GETcoursesv3, string[]>
) {
  return useQuery({
    queryKey: [
      TanstackKeys.CourseBasic,
      ...getQueryKeysFromParamsObject(params),
    ],
    queryFn: async () => {
      const res = await axios.get(
        GETcoursesv3ApiUrl({
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
