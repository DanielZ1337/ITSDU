import {
	updateAvailableVersionAtom,
	updateCheckErrorAtom,
	updateReadyAtom,
} from "@/atoms/update-status";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useSettings } from "@/hooks/atoms/useSettings";
import { useShowSettingsModal } from "@/hooks/atoms/useSettingsModal";
import { useNotificationCenter } from "@/hooks/useNotificationCenter";
import { normalizeCalendarEvents } from "@/lib/calendar/calendar-events";
import {
	buildNotificationItems,
	groupNotificationItems,
} from "@/lib/notifications/build-notifications";
import useGETcalendarEvents from "@/queries/calendar/useGETcalendarEvents";
import useGETinstantMessagesv2 from "@/queries/messages/useGETinstantMessagesv2";
import useGETpersonalTasks from "@/queries/tasks/useGETpersonalTasks";
import { ItslearningRestApiEntitiesTaskDeadlineFilter } from "@/types/api-types/utils/Itslearning.RestApi.Entities.TaskDeadlineFilter";
import { ItslearningRestApiEntitiesTaskStatusFilter } from "@/types/api-types/utils/Itslearning.RestApi.Entities.TaskStatusFilter";
import type {
	AppNotificationItem,
	AppNotificationSource,
} from "@/types/app-notifications";
import { useAtomValue } from "jotai";
import {
	Bell,
	CalendarDays,
	CheckSquare,
	Inbox,
	MessageSquare,
	RotateCw,
} from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const sourceIcon: Record<AppNotificationSource, React.ReactNode> = {
	message: <MessageSquare className="h-4 w-4" />,
	task: <CheckSquare className="h-4 w-4" />,
	calendar: <CalendarDays className="h-4 w-4" />,
	update: <RotateCw className="h-4 w-4" />,
};

export default function NotificationCenter() {
	const [open, setOpen] = useState(false);
	const navigate = useNavigate();
	const { settings } = useSettings();
	const { openSettingsSection } = useShowSettingsModal();
	const { seenIds, markSeen } = useNotificationCenter();

	const updateReady = useAtomValue(updateReadyAtom);
	const updateAvailableVersion = useAtomValue(updateAvailableVersionAtom);
	const updateError = useAtomValue(updateCheckErrorAtom);

	const messagesQuery = useGETinstantMessagesv2(
		{ maxThreadCount: 15, threadPage: 0, maxMessages: 1 },
		{
			enabled: open && settings.notificationsMessages,
			staleTime: 1000 * 60,
		},
	);
	const tasksQuery = useGETpersonalTasks(
		{
			PageIndex: 0,
			PageSize: 30,
			status: ItslearningRestApiEntitiesTaskStatusFilter.Active,
			deadline: ItslearningRestApiEntitiesTaskDeadlineFilter.All,
		},
		{
			enabled: open && settings.notificationsTasks,
			suspense: false,
			staleTime: 1000 * 60,
		},
	);
	const calendarQuery = useGETcalendarEvents(
		{ fromDate: new Date(), page: 0, pageSize: 20 },
		{ enabled: open, suspense: false, staleTime: 1000 * 60 },
	);

	const items = useMemo(() => {
		const threads = settings.notificationsMessages
			? (messagesQuery.data?.pages.flatMap((page) => page.EntityArray) ?? [])
			: [];
		const tasks = settings.notificationsTasks
			? (tasksQuery.data?.EntityArray ?? [])
			: [];
		const events = normalizeCalendarEvents(
			calendarQuery.data?.EntityArray ?? [],
		);

		return buildNotificationItems({
			threads,
			tasks,
			events,
			update: settings.notificationsAppUpdates
				? {
						ready: updateReady,
						availableVersion: updateAvailableVersion,
						error: updateError,
					}
				: undefined,
			seenIds,
		});
	}, [
		calendarQuery.data,
		messagesQuery.data,
		seenIds,
		settings.notificationsAppUpdates,
		settings.notificationsMessages,
		settings.notificationsTasks,
		tasksQuery.data,
		updateAvailableVersion,
		updateError,
		updateReady,
	]);

	const groups = useMemo(() => groupNotificationItems(items), [items]);
	const unreadCount = items.filter((item) => item.unread).length;

	const handleItemClick = (item: AppNotificationItem) => {
		setOpen(false);
		markSeen([item.id]);

		if (item.source === "update") {
			openSettingsSection("appUpdates");
			return;
		}
		if (!item.href) return;
		if (item.source === "task") {
			void window.app.openExternal(item.href);
			return;
		}
		navigate(item.href);
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button variant="ghost" size="icon" className="relative shrink-0">
					<Bell className="h-5 w-5" />
					{unreadCount > 0 && (
						<span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
							{unreadCount > 9 ? "9+" : unreadCount}
						</span>
					)}
					<span className="sr-only">Notifications</span>
				</Button>
			</PopoverTrigger>
			<PopoverContent align="end" className="w-96 p-0">
				<div className="flex items-center justify-between border-b px-4 py-3">
					<div>
						<h2 className="text-sm font-semibold">Notifications</h2>
						<p className="text-xs text-muted-foreground">
							{unreadCount > 0
								? `${unreadCount} unread`
								: "You're all caught up"}
						</p>
					</div>
					{items.length > 0 && (
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={() => markSeen(items.map((item) => item.id))}
						>
							Mark all read
						</Button>
					)}
				</div>
				<div className="max-h-96 overflow-y-auto p-2">
					{groups.length === 0 ? (
						<div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
							<Inbox className="h-5 w-5 text-muted-foreground" />
							<p className="text-sm text-muted-foreground">
								Nothing new right now.
							</p>
						</div>
					) : (
						groups.map((group) => (
							<div key={group.key} className="mb-2">
								<p className="px-2 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
									{group.label}
								</p>
								<div className="flex flex-col gap-1">
									{group.items.map((item) => (
										<button
											key={item.id}
											type="button"
											onClick={() => handleItemClick(item)}
											className="flex w-full items-start gap-3 rounded-md px-2 py-2 text-left transition-colors hover:bg-accent"
										>
											<span
												className={
													item.unread
														? "mt-0.5 text-primary"
														: "mt-0.5 text-muted-foreground"
												}
											>
												{sourceIcon[item.source]}
											</span>
											<div className="min-w-0 flex-1">
												<p
													className={
														item.unread
															? "truncate text-sm font-medium"
															: "truncate text-sm text-muted-foreground"
													}
												>
													{item.title}
												</p>
												{item.description && (
													<p className="truncate text-xs text-muted-foreground">
														{item.description}
													</p>
												)}
											</div>
										</button>
									))}
								</div>
							</div>
						))
					)}
				</div>
			</PopoverContent>
		</Popover>
	);
}
