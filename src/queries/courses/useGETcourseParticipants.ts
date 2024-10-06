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
  const fetchAllPages = async (
    accumulatedData: GETcourseParticipants["EntityArray"] = [],
    pageIndex = 0,
  ): Promise<GETcourseParticipants> => {
    const res = await axios.get(
      GETcourseParticipantsApiUrl({
        ...params,
        PageIndex: pageIndex,
      }),
      {
        params: {
          access_token: (await getAccessToken()) || "",
          ...params,
        },
      },
    );

    if (res.status !== 200) throw new Error(res.statusText);

    const currentData = res.data.EntityArray;
    const combinedData = [...accumulatedData, ...currentData];

    if (res.data.Total > res.data.PageSize * (pageIndex + 1)) {
      return fetchAllPages(combinedData, pageIndex + 1);
    }

    return {
      ...res.data,
      EntityArray: combinedData,
    };
  };

  return useQuery(
    [TanstackKeys.CourseParticipants, ...getQueryKeysFromParamsObject(params)],
    () => fetchAllPages(),
    {
      ...queryConfig,
    },
  );
}
