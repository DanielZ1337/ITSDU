import { UnreadNotificationIndicator } from "@/components/messages/unread-notification-indicator.tsx";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UnreadNotificationsPingIndicator from "@/components/unread-notifications-ping-indicator.tsx";
import useFetchNextPageOnInView from "@/hooks/useFetchNextPageOnView";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { getRelativeTimeString } from "@/lib/utils";
import useGETnotifications from "@/queries/notifications/useGETnotifications";
import usePUTnotificationsMarkAllAsRead from "@/queries/notifications/usePUTnotificationsMarkAllAsRead";
import usePUTnotificationsMarkAllAsReadv2 from "@/queries/notifications/usePUTnotificationsMarkAllAsReadv2";
import { ScrollShadow } from "@nextui-org/react";
import { ArrowRightIcon } from "lucide-react";
import { AiOutlineNotification } from "react-icons/ai";
import { Link } from "react-router-dom";
import NotificationsDropdownInfiniteFallback from "./fallback/notifications-dropdown-infinite-fallback";
import NotificationsDropdownInfiniteEnd from "./notifications-dropdown-infinite-end";

export default function NotificationsDropdown() {
	const {
		data: notifications,
		fetchNextPage,
		isFetchingNextPage,
		hasNextPage,
	} = useGETnotifications(
		{
			FromId: 0,
			PageSize: DEFAULT_PAGE_SIZE,
			UseNewerThan: true,
		},
		{
			suspense: true,
		},
	);

	const { mutate: markAllAsRead, isLoading: isMarkingAllAsRead } =
		usePUTnotificationsMarkAllAsReadv2();

	const notificationsFlatMap = notifications!.pages.flatMap(
		(page) => page.EntityArray,
	);

	const unreadNotifications = notificationsFlatMap?.filter(
		(notification) => !notification.IsRead,
	);

	const ref = useFetchNextPageOnInView(
		hasNextPage,
		fetchNextPage,
		isFetchingNextPage,
	);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant={"ghost"} size={"icon"} className={"shrink-0 relative"}>
					<AiOutlineNotification className={"w-7 h-7"} />
					{unreadNotifications.length > 0 && (
						<UnreadNotificationsPingIndicator
							amount={unreadNotifications.length}
						/>
					)}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuLabel className={"flex justify-between items-center"}>
					<Link
						to={"/updates"}
						className={"group flex gap-1 items-center justify-center"}
					>
						<span className={"text-base font-medium group-hover:underline"}>
							Notifications
						</span>
						<ArrowRightIcon
							className={
								"stroke-foreground w-4 h-4 group-hover:translate-x-1/3 transition-all duration-200"
							}
						/>
					</Link>
					<div>
						<Button
							variant={"ghost"}
							size={"sm"}
							className="mr-1 h-fit"
							disabled={isMarkingAllAsRead}
							onClick={() => markAllAsRead(undefined)}
						>
							Mark all as read
						</Button>
						<span className={"text-xs text-muted-foreground"}>
							{unreadNotifications.length} unread
						</span>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<ScrollShadow
					className={
						"max-h-96 overflow-y-auto p-2 flex-1 w-full my-2 px-2 scrollbar overflow-x-hidden hover:scrollbar-thumb-foreground/15 active:scrollbar-thumb-foreground/10 scrollbar-thumb-foreground/20 scrollbar-w-2 scrollbar-thumb-rounded-full"
					}
				>
					{notifications?.pages.map((page) =>
						page.EntityArray.map((notification) => (
							<Link
								to={`/updates/${notification.NotificationId}`}
								className={"flex hover:bg-foreground/10 rounded-md my-1"}
								key={notification.NotificationId}
							>
								<UnreadNotificationIndicator
									read={notification.IsRead}
									className={"ml-2"}
								/>
								<div
									className={"flex flex-col gap-1 p-4"}
									key={notification.NotificationId}
								>
									<div className={"flex flex-row gap-1"}>
										<div className={"flex flex-col"}>
											<span className={"text-sm font-semibold"}>
												{notification.PublishedBy.FullName}
											</span>
											<span className={"text-xs text-gray-400"}>
												{getRelativeTimeString(
													new Date(notification.PublishedDate),
												)}
											</span>
										</div>
									</div>
									<div className={"flex flex-row gap-1"}>
										<div className={"flex flex-col"}>
											<span
												className={
													"text-xs text-gray-400 line-clamp-1 break-all"
												}
											>
												{notification.Text}
											</span>
										</div>
									</div>
								</div>
							</Link>
						)),
					)}
					{isFetchingNextPage && <NotificationsDropdownInfiniteFallback />}
					{!hasNextPage && <NotificationsDropdownInfiniteEnd />}
					{hasNextPage && <div ref={ref} />}
				</ScrollShadow>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
