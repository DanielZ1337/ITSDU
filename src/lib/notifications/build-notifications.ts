import type { NormalizedCalendarEvent } from "@/lib/calendar/calendar-events";
import type { ItslearningRestApiEntitiesInstantMessageThread } from "@/types/api-types/utils/Itslearning.RestApi.Entities.InstantMessageThread";
import type { ItslearningRestApiEntitiesTask } from "@/types/api-types/utils/Itslearning.RestApi.Entities.Task";
import type {
	AppNotificationGroup,
	AppNotificationItem,
} from "@/types/app-notifications";

export type UpdateNotificationStatus = {
	availableVersion?: string | null;
	ready?: boolean;
	error?: string | null;
};

type BuildNotificationsInput = {
	threads?: ItslearningRestApiEntitiesInstantMessageThread[];
	tasks?: ItslearningRestApiEntitiesTask[];
	events?: NormalizedCalendarEvent[];
	update?: UpdateNotificationStatus;
	seenIds: Set<string>;
	now?: Date;
};

const HOUR_MS = 1000 * 60 * 60;

export function buildNotificationItems({
	threads = [],
	tasks = [],
	events = [],
	update,
	seenIds,
	now = new Date(),
}: BuildNotificationsInput): AppNotificationItem[] {
	const items: AppNotificationItem[] = [];

	for (const thread of threads) {
		if (!thread.LastMessage) continue;
		if (thread.LastMessage.MessageId === thread.LastReadInstantMessageId) {
			continue;
		}

		const id = `message:${thread.InstantMessageThreadId}`;
		items.push({
			id,
			source: "message",
			title: thread.Name || thread.LastMessage.CreatedByName || "New message",
			description: thread.LastMessage.Text || undefined,
			timestamp: thread.LastMessage.Created
				? new Date(thread.LastMessage.Created)
				: now,
			unread: !seenIds.has(id),
			href: `/messages/${thread.InstantMessageThreadId}`,
		});
	}

	for (const task of tasks) {
		const deadline = parseDeadline(task.Deadline);
		if (!deadline) continue;

		const isOverdue = deadline.getTime() < now.getTime();
		const dueWithinADay = deadline.getTime() - now.getTime() <= 24 * HOUR_MS;
		if (!isOverdue && !dueWithinADay) continue;

		const id = `task:${task.TaskId}`;
		items.push({
			id,
			source: "task",
			title: task.Title,
			description: isOverdue ? "Overdue" : "Due today",
			timestamp: deadline,
			unread: !seenIds.has(id),
			href: task.Url,
		});
	}

	for (const event of events) {
		if (!event.startsAt || event.isPast) continue;
		const hoursUntil = (event.startsAt.getTime() - now.getTime()) / HOUR_MS;
		if (hoursUntil > 24) continue;

		const id = `calendar:${event.id}`;
		items.push({
			id,
			source: "calendar",
			title: event.title,
			description: event.location,
			timestamp: event.startsAt,
			unread: !seenIds.has(id),
			href: event.numericId
				? `/calendar?eventId=${event.numericId}`
				: "/calendar",
		});
	}

	if (update?.error) {
		const id = "update:error";
		items.push({
			id,
			source: "update",
			title: "Update check failed",
			description: update.error,
			timestamp: now,
			unread: !seenIds.has(id),
		});
	} else if (update?.ready) {
		const id = "update:ready";
		items.push({
			id,
			source: "update",
			title: "Update ready to install",
			description: "Restart ITSDU to finish updating.",
			timestamp: now,
			unread: !seenIds.has(id),
		});
	} else if (update?.availableVersion) {
		const id = `update:${update.availableVersion}`;
		items.push({
			id,
			source: "update",
			title: `Update available: v${update.availableVersion}`,
			description: "Open App & Updates in Settings to download.",
			timestamp: now,
			unread: !seenIds.has(id),
		});
	}

	return items.sort((a, b) => {
		if (a.unread !== b.unread) return a.unread ? -1 : 1;
		return b.timestamp.getTime() - a.timestamp.getTime();
	});
}

export function groupNotificationItems(
	items: AppNotificationItem[],
	now = new Date(),
): AppNotificationGroup[] {
	const groups: AppNotificationGroup[] = [
		{ key: "now", label: "Now", items: [] },
		{ key: "today", label: "Today", items: [] },
		{ key: "earlier", label: "Earlier", items: [] },
	];

	for (const item of items) {
		const diffMs = item.timestamp.getTime() - now.getTime();
		const isFutureSoon = diffMs > 0 && diffMs <= HOUR_MS * 3;
		const isRecentlyOverdue = diffMs < 0 && diffMs >= -HOUR_MS * 3;

		if (isFutureSoon || isRecentlyOverdue) {
			groups[0].items.push(item);
		} else if (isSameCalendarDay(item.timestamp, now)) {
			groups[1].items.push(item);
		} else {
			groups[2].items.push(item);
		}
	}

	return groups.filter((group) => group.items.length > 0);
}

function isSameCalendarDay(a: Date, b: Date) {
	return (
		a.getFullYear() === b.getFullYear() &&
		a.getMonth() === b.getMonth() &&
		a.getDate() === b.getDate()
	);
}

function parseDeadline(value: Date | string) {
	const date = new Date(value);
	if (Number.isNaN(date.getTime()) || date.getFullYear() < 2000) return null;
	return date;
}
