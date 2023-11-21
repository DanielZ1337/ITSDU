import useGETnotificationsStream from "@/queries/notifications/useGETnotificationsStream";
import { Suspense, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Skeleton } from "@nextui-org/react";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import { Button } from "@/components/ui/button.tsx";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import NotificationCard from "@/components/notifications/notifications-card";
import UpdatesTypeSelect, {
    UpdatesType,
    getFilteredUpdates,
    useUpdatesTypeSelect
} from "@/components/notifications/notifications-updates-type-select";


export default function NotificationUpdates() {
    const { data: notifications, fetchNextPage, hasNextPage, isFetchingNextPage } = useGETnotificationsStream({
        showLightBulletins: true,
        PageIndex: 0,
        PageSize: 10,
        UseNewerThan: true,
    }, {
        suspense: true,
        keepPreviousData: true,
    })

    const { selectedUpdatesType, setSelectedUpdatesType, filteredNotifications } = useUpdatesTypeSelect(notifications)

    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, fetchNextPage]);

    return (
        <>
            <div
                className="py-5 sticky top-0 flex items-center gap-4 border-b bg-zinc-100/40 px-6 dark:bg-zinc-800/40 backdrop-blur-md shadow z-10 justify-between">
                <h1 className="text-2xl font-bold">Recent Updates</h1>
                <UpdatesTypeSelect update={selectedUpdatesType} onChange={setSelectedUpdatesType} />
            </div>
            <div className="p-6">
                <div className="flex flex-col gap-4">
                    {filteredNotifications && filteredNotifications.map((page) => (
                        page.map((notification) => (
                            <Suspense fallback={
                                <Skeleton className="bg-foreground/10 rounded-md py-8" />
                            } key={notification.NotificationId}>
                                <NotificationCard key={notification.NotificationId} notification={notification} />
                            </Suspense>
                        ))
                    ))}
                </div>
                <div ref={ref} className="text-center mt-4 text-gray-600 text-sm">
                    {isFetchingNextPage ? 'Fetching more notifications...' : 'End of notifications'}
                </div>
            </div>
        </>
    )
}

