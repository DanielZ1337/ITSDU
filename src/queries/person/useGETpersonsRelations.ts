import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
  GETpersonsRelations,
  GETpersonsRelationsApiUrl,
  GETpersonsRelationsParams,
} from "@/types/api-types/person/GETpersonsRelations.ts";
import { TanstackKeys } from "@/types/tanstack-keys";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function useGETpersonsRelations(
  params: GETpersonsRelationsParams,
  queryConfig?: UseQueryOptions<
    GETpersonsRelations,
    Error,
    GETpersonsRelations,
    string[]
  >,
) {
  return useQuery(
    [TanstackKeys.PersonsRelations, ...getQueryKeysFromParamsObject(params)],
    async () => {
      const res = await axios.get(GETpersonsRelationsApiUrl(params), {
        params: {
          access_token: (await getAccessToken()) || "",
        },
      });

      if (res.status !== 200) throw new Error(res.statusText);

      return res.data;
    },
    {
      ...queryConfig,
    },
  );
}
