import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { AiOutlineNotification } from 'react-icons/ai';
import { Button } from '@/components/ui/button';
import useGETnotifications from '@/queries/notifications/useGETnotifications';
import { getRelativeTimeString } from '@/lib/utils';
import UnreadNotificationsPingIndicator from "@/components/unread-notifications-ping-indicator.tsx";
import { UnreadNotificationIndicator } from "@/components/messages/unread-notification-indicator.tsx";
import { Link } from "react-router-dom";
import { ArrowRightIcon } from "lucide-react";
import { ScrollShadow } from '@nextui-org/react';
import usePUTnotificationsMarkAllAsRead from '@/queries/notifications/usePUTnotificationsMarkAllAsRead';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import NotificationsDropdownInfiniteFallback from './fallback/notifications-dropdown-infinite-fallback';
import NotificationsDropdownInfiniteEnd from './notifications-dropdown-infinite-end';

export default function NotificationsDropdown() {

    const { data: notifications, fetchNextPage, isFetchingNextPage, hasNextPage } = useGETnotifications({
        FromId: 0,
        PageSize: 10,
        UseNewerThan: true,
    }, {
        suspense: true,
    })

    const { ref, inView } = useInView()

    const { mutate: markAllAsRead, isLoading: isMarkingAllAsRead } = usePUTnotificationsMarkAllAsRead()

    const notificationsFlatMap = notifications!.pages.flatMap(page => page.EntityArray)

    const unreadNotifications = notificationsFlatMap?.filter(notification => !notification.IsRead)

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant={"ghost"}
                    size={"icon"}
                    className={"shrink-0 relative"}
                >
                    <AiOutlineNotification className={"w-7 h-7"} />
                    {unreadNotifications.length > 0 && (
                        <UnreadNotificationsPingIndicator amount={unreadNotifications.length} />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel className={"flex justify-between items-center"}>
                    <Link to={"/updates"} className={"group flex gap-1 items-center justify-center"}>
                        <span className={"text-base font-medium group-hover:underline"}>
                            Notifications
                        </span>
                        <ArrowRightIcon
                            className={"stroke-foreground w-4 h-4 group-hover:translate-x-1/3 transition-all duration-200"} />
                    </Link>
                    <div>
                        <Button variant={"ghost"} size={"sm"} className="h-fit mr-1" disabled={isMarkingAllAsRead}
                            onClick={() => markAllAsRead(undefined)}>
                            Mark all as read
                        </Button>
                        <span className={"text-xs text-muted-foreground"}>
                            {unreadNotifications.length} unread
                        </span>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <ScrollShadow
                    className={"max-h-96 overflow-y-auto p-2 flex-1 w-full my-2 px-2 scrollbar overflow-x-hidden hover:scrollbar-thumb-foreground/15 active:scrollbar-thumb-foreground/10 scrollbar-thumb-foreground/20 scrollbar-w-2 scrollbar-thumb-rounded-full"}>
                    {notifications?.pages.map((page) => (
                        page.EntityArray.map(notification => (
                            <Link
                                to={`/updates/${notification.NotificationId}`}
                                className={"flex hover:bg-foreground/10 rounded-md my-1"}
                                key={notification.NotificationId}>
                                <UnreadNotificationIndicator
                                    read={notification.IsRead}
                                    className={"ml-2"}
                                />
                                <div className={"flex flex-col gap-1 p-4"}
                                    key={notification.NotificationId}>
                                    <div className={"flex flex-row gap-1"}>
                                        <div className={"flex flex-col"}>
                                            <span
                                                className={"text-sm font-semibold"}>{notification.PublishedBy.FullName}</span>
                                            <span
                                                className={"text-xs text-gray-400"}>{getRelativeTimeString(new Date(notification.PublishedDate))}</span>
                                        </div>
                                    </div>
                                    <div className={"flex flex-row gap-1"}>
                                        <div className={"flex flex-col"}>
                                            <span
                                                className={"text-xs text-gray-400 line-clamp-1 break-all"}>{notification.Text}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ))}
                    {isFetchingNextPage && (
                        <NotificationsDropdownInfiniteFallback />
                    )}
                    {!hasNextPage && (
                        <NotificationsDropdownInfiniteEnd />
                    )}
                    {hasNextPage && <div ref={ref} />}
                </ScrollShadow>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
