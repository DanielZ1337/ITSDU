import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";
import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
  GETnotificationsTopMenu,
  GETnotificationsTopMenuApiParams,
  GETnotificationsTopMenuApiUrl,
} from "@/types/api-types/notifications/GETnotifcationsTopMenu";
import { TanstackKeys } from "@/types/tanstack-keys";

export default function useGETnotificationsTopMenu(
  params: GETnotificationsTopMenuApiParams,
  queryConfig?: UseQueryOptions<
    GETnotificationsTopMenuApiParams,
    Error,
    GETnotificationsTopMenu,
    string[]
  >
) {
  return useQuery({
    queryKey: [
      TanstackKeys.NotificationsTopMenu,
      ...getQueryKeysFromParamsObject(params),
    ],
    queryFn: async () => {
      const res = await axios.get(GETnotificationsTopMenuApiUrl(params), {
        params: {
          access_token: (await getAccessToken()) || "",
        },
      });

      if (res.status !== 200) throw new Error(res.statusText);

      return res.data;
    },
    ...queryConfig,
  });
}
