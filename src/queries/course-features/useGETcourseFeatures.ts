import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
  GETcourseFeatures,
  GETcourseFeaturesApiUrl,
  GETcourseFeaturesParams,
} from "@/types/api-types/course-features/GETcourseFeatures.ts";
import { TanstackKeys } from "@/types/tanstack-keys";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function useGETcourseFeatures(
  params: GETcourseFeaturesParams,
  queryConfig?: UseQueryOptions<GETcourseFeatures, Error, GETcourseFeatures, string[]>,
) {
  return useQuery(
    [TanstackKeys.CourseFeatures, ...getQueryKeysFromParamsObject(params)],
    async () => {
      const res = await axios.get(
        GETcourseFeaturesApiUrl({
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
