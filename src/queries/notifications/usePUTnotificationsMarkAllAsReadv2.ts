import { queryClient } from "@/lib/tanstack-client";
import { getAccessToken } from "@/lib/utils.ts";
import {
	type GETnotifications,
	GETnotificationsApiUrl,
	type GETnotificationsParams,
} from "@/types/api-types/notifications/GETnotifications";
import { PUTnotificationsMarkAsReadApiUrl } from "@/types/api-types/notifications/PUTnotificationsMarkAsRead";
import { TanstackKeys } from "@/types/tanstack-keys";
import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import axios from "axios";

export default function usePUTnotificationsMarkAllAsReadv2(
	queryConfig?: UseMutationOptions<undefined, Error, undefined, string[]>,
) {
	return useMutation(
		[TanstackKeys.PUTnotificationsMarkAllAsRead],
		async () => {
			const allNotifications = await getNotificationsRecursively({
				PageSize: 100,
			});

			const res = await axios.put(
				PUTnotificationsMarkAsReadApiUrl(),
				[
					...allNotifications.map((notification) => ({
						NotificationId: notification.NotificationId,
						IsRead: true,
					})),
				],
				{
					params: {
						access_token: (await getAccessToken()) || "",
					},
				},
			);

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

// Recursive function to fetch all notifications
async function getNotificationsRecursively({
	PageIndex = 0,
	total,
	PageSize = 100,
}: GETnotificationsParams & {
	total?: number;
}): Promise<GETnotifications["EntityArray"]> {
	// Replace `any` with your actual notification type
	try {
		// Fetch the current page of notifications
		const response = await axios.get<GETnotifications>(
			GETnotificationsApiUrl({ PageIndex: PageIndex }),
			{
				params: {
					access_token: (await getAccessToken()) || "",
					pageSize: PageSize,
				},
			},
		);

		const { EntityArray, Total } = response.data;

		// Initialize total if it's not set
		const currentTotal = total ?? Total;

		// Calculate if there are more pages to fetch
		const hasMore = PageSize * PageIndex < currentTotal;

		if (hasMore) {
			// Recursively fetch the next page
			const nextNotifications = await getNotificationsRecursively({
				PageIndex: PageIndex + 1,
				total: currentTotal,
				PageSize: PageSize,
			});
			// Combine current notifications with the next pages
			return EntityArray.concat(nextNotifications);
		} else {
			// No more pages, return the current notifications
			return EntityArray;
		}
	} catch (error) {
		console.error("Error fetching notifications:", error);
		return []; // Return an empty array or handle the error as needed
	}
}
