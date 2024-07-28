import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";
import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
  GETcourseFolderResources,
  GETcourseFolderResourcesApiUrl,
  GETcourseFolderResourcesParams,
} from "@/types/api-types/courses/GETcourseFolderResources.ts";
import { TanstackKeys } from "@/types/tanstack-keys";

export default function useGETcourseFolderResources(
  params: GETcourseFolderResourcesParams,
  queryConfig?: UseQueryOptions<
    GETcourseFolderResources,
    Error,
    GETcourseFolderResources,
    string[]
  >
) {
  return useQuery({
    queryKey: [
      TanstackKeys.CourseFolderResources,
      ...getQueryKeysFromParamsObject(params),
    ],
    queryFn: async () => {
      const res = await axios.get(
        GETcourseFolderResourcesApiUrl({
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
