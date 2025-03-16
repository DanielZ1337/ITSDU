import useGETunreadInstantMessageCount from "@/queries/messages/useGETunreadInstantMessageCount";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGETinstantMessagesv3 from "../queries/messages/useGETinstantMessagesv3";
import useGETinstantMessagesv2 from "@/queries/messages/useGETinstantMessagesv2";
import { TanstackKeys } from "@/types/tanstack-keys";
import { queryClient } from "@/lib/tanstack-client";

type UnreadMessages = {
	count: number;
	timestamp: number;
};

const REFETCH_INTERVAL = 1000 * 15; // 15 seconds
const MIN_NOTIFICATION_INTERVAL = 1000 * 60 * 5; // 5 minutes

export function useUnreadMessagesNotification() {
	const navigate = useNavigate();
	const lastNotificationTimestamp = useRef<number>(0);
	const lastNotificationCount = useRef<number>(0);
	const [unreadCount, setUnreadCount] = useState<number>(0);

	// Fetch unread message count
	useGETunreadInstantMessageCount({
		refetchInterval: REFETCH_INTERVAL,
		refetchIntervalInBackground: true,
		onSuccess: (data) => {
			setUnreadCount(data);
		},
	});

	// Only fetch message details when there's exactly 1 unread message
	const { data: messageThreads } = useGETinstantMessagesv2(
		{},
		{
			enabled: unreadCount === 1,
			refetchInterval: REFETCH_INTERVAL,
		},
	);

	useEffect(() => {
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
	}, [unreadCount, messageThreads, navigate]);
}
