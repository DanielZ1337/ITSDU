import { queryClient } from "@/lib/tanstack-client";
import useGETinstantMessagesv2 from "@/queries/messages/useGETinstantMessagesv2";
import useGETunreadInstantMessageCount from "@/queries/messages/useGETunreadInstantMessageCount";
import { isQuietHoursActive } from "@/types/settings";
import { TanstackKeys } from "@/types/tanstack-keys";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSettings } from "./atoms/useSettings";

const REFETCH_INTERVAL = 1000 * 30; // 30 seconds
const MIN_NOTIFICATION_INTERVAL = 1000 * 60 * 5; // 5 minutes

export function useUnreadMessagesNotification() {
	const navigate = useNavigate();
	const lastNotificationTimestamp = useRef<number>(0);
	const lastNotificationCount = useRef<number>(0);
	const [unreadCount, setUnreadCount] = useState<number>(0);
	const { settings, isHydrated } = useSettings();
	const notificationsEnabled =
		isHydrated &&
		settings.notificationsMessages &&
		!isQuietHoursActive(settings);

	// Fetch unread message count.
	// `refetchIntervalInBackground` is intentionally omitted so React Query pauses
	// polling while the window is hidden/minimized/unfocused.
	useGETunreadInstantMessageCount({
		enabled: notificationsEnabled,
		refetchInterval: REFETCH_INTERVAL,
		onSuccess: (data) => {
			setUnreadCount(data);
		},
	});

	// Only fetch message details when there's exactly 1 unread message
	const { data: messageThreads } = useGETinstantMessagesv2(
		{},
		{
			enabled: notificationsEnabled && unreadCount === 1,
			refetchInterval: REFETCH_INTERVAL,
		},
	);

	useEffect(() => {
		if (!notificationsEnabled) return;

		// Don't proceed if there are no unread messages
		if (!unreadCount) return;

		const now = Date.now();

		// Check if enough time has passed since the last notification
		const timeSinceLastNotification = now - lastNotificationTimestamp.current;
		if (timeSinceLastNotification < MIN_NOTIFICATION_INTERVAL) return;

		// Don't notify if the count hasn't changed since the last notification
		if (unreadCount === lastNotificationCount.current) return;

		// Create the appropriate notification
		if (unreadCount === 1) {
			if (!messageThreads) return;

			const threads = messageThreads.pages.flatMap((page) => page.EntityArray);
			const unreadMessageThread = threads?.find(
				(thread) =>
					thread.LastMessage.MessageId !== thread.LastReadInstantMessageId,
			);

			if (!unreadMessageThread) return;

			const notification = new Notification("itslearning", {
				body: `You have a message from ${unreadMessageThread.LastMessage.CreatedByName}`,
				icon: "itsl-itslearning-file://icon.ico",
			});

			notification.onclick = () => {
				window.app
					.focus()
					.then(() =>
						navigate(`/messages/${unreadMessageThread.InstantMessageThreadId}`),
					);
			};
		} else if (unreadCount > 1) {
			const notification = new Notification("itslearning", {
				body: `You have ${unreadCount} unread messages`,
				icon: "itsl-itslearning-file://icon.ico",
			});

			notification.onclick = () => {
				window.app.focus().then(() => navigate("/messages"));
			};
		}

		// Update refs to track this notification
		lastNotificationTimestamp.current = now;
		lastNotificationCount.current = unreadCount;

		// Invalidate the state other places
		queryClient.invalidateQueries([TanstackKeys.Messagesv2]);
	}, [notificationsEnabled, unreadCount, messageThreads, navigate]);
}
