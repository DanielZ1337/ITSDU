import useGETnotificationsStream from "@/queries/notifications/useGETnotificationsStream";
import { Suspense, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Skeleton } from "@nextui-org/react";
import NotificationCard from "@/components/notifications/notifications-card";


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

    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, fetchNextPage]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Recent Updates</h1>
            <div className="flex flex-col gap-4">
                {notifications && notifications.pages.map((page) => (
                    page.EntityArray.map((notification) => (
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
    )
}