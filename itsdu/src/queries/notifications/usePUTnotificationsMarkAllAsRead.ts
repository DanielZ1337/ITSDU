import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import axios from "axios";
import { getAccessToken } from "@/lib/utils.ts";
import { PUTnotificationsMarkAllAsReadApiUrl } from "@/types/api-types/notifications/PUTnotificationsMarkAllAsRead";
import { TanstackKeys } from "@/types/tanstack-keys";

export default function usePUTnotificationsMarkAllAsRead(
  queryConfig?: UseMutationOptions<undefined, Error, undefined, string[]>
) {
  return useMutation({
    mutationKey: [TanstackKeys.PUTnotificationsMarkAllAsRead],
    mutationFn: async () => {
      const res = await axios.put(
        PUTnotificationsMarkAllAsReadApiUrl(),
        undefined,
        {
          params: {
            access_token: (await getAccessToken()) || "",
          },
        }
      );

      if (res.status !== 200) throw new Error(res.statusText);

      return res.data;
    },
    ...queryConfig,
  });
}
