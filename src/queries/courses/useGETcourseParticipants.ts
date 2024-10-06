import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
  GETcourseParticipants,
  GETcourseParticipantsApiUrl,
  GETcourseParticipantsParams,
} from "@/types/api-types/courses/GETcourseParticipants.ts";
import { TanstackKeys } from "@/types/tanstack-keys";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function useGETcourseParticipants(
  params: GETcourseParticipantsParams,
  queryConfig?: UseQueryOptions<
    GETcourseParticipants,
    Error,
    GETcourseParticipants,
    string[]
  >,
) {
  return useQuery(
    [TanstackKeys.CourseParticipants, ...getQueryKeysFromParamsObject(params)],
    async () => {
      const res = await axios.get(
        GETcourseParticipantsApiUrl({
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
