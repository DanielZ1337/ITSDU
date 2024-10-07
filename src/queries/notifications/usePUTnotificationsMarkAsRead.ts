import { queryClient } from "@/lib/tanstack-client";
import { getAccessToken } from "@/lib/utils.ts";
import {
  PUTnotificationsMarkAsReadApiUrl,
  PUTnotificationsMarkAsReadv2Body,
} from "@/types/api-types/notifications/PUTnotificationsMarkAsRead";
import { TanstackKeys } from "@/types/tanstack-keys";
import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import axios from "axios";

export default function usePUTnotificationsMarkAsRead(
  queryConfig?: UseMutationOptions<
    PUTnotificationsMarkAsReadv2Body,
    Error,
    PUTnotificationsMarkAsReadv2Body,
    string[]
  >,
) {
  return useMutation(
    [TanstackKeys.PUTnotificationsMarkAllAsRead],
    async (body) => {
      const res = await axios.put(PUTnotificationsMarkAsReadApiUrl(), body, {
        params: {
          access_token: (await getAccessToken()) || "",
        },
      });

      if (res.status !== 200) throw new Error(res.statusText);

      return res.data;
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries([TanstackKeys.Notifications], {
          exact: false,
        });
        queryClient.invalidateQueries(
          [
            TanstackKeys.NotificationElements,
            TanstackKeys.Notifications,
            TanstackKeys.NotificationsStream,
            TanstackKeys.NotificationsTopMenu,
          ],
          {
            exact: false,
            queryKey: [
              TanstackKeys.NotificationElements,
              TanstackKeys.Notifications,
              TanstackKeys.NotificationsStream,
              TanstackKeys.NotificationsTopMenu,
            ],
          },
        );
      },
      ...queryConfig,
    },
  );
}
