import { Suspense, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Skeleton } from "@nextui-org/react";
import NotificationCard from "@/components/notifications/notifications-card";
import useGETcourseNotifications from "@/queries/courses/useGETcourseNotifications";
import { useParams } from "react-router-dom";
import UpdatesTypeSelect, {
    useUpdatesTypeSelect
} from "@/components/notifications/notifications-updates-type-select";
import useFetchNextPageOnInView from "@/hooks/useFetchNextPageOnView";


export default function CourseAnnouncements() {
    const { id } = useParams();
    const { data: updates, fetchNextPage, hasNextPage, isFetchingNextPage } = useGETcourseNotifications({
        courseId: Number(id),
        showLightBulletins: true,
        PageIndex: 0,
        PageSize: 10,
    }, {
        suspense: true,
        keepPreviousData: true,
    })

    const { selectedUpdatesType, setSelectedUpdatesType, filteredNotifications } = useUpdatesTypeSelect(updates)

    const ref = useFetchNextPageOnInView(hasNextPage, fetchNextPage)

    return (
        <>
            <div
                className="py-5 sticky top-0 flex items-center gap-4 border-b px-6 bg-zinc-100/40 dark:bg-zinc-800/40 backdrop-blur-md shadow justify-between">
                <h1 className="text-xl font-bold">Recent Updates
                    for {updates?.pages[0].EntityArray[0].LocationTitle}</h1>
                <UpdatesTypeSelect update={selectedUpdatesType} onChange={setSelectedUpdatesType} />
            </div>
            <div className="p-6">
                <div className="flex flex-col gap-4">
                    {filteredNotifications && filteredNotifications.map((page) => (
                        page.map((update) => (
                            <Suspense fallback={
                                <Skeleton className="bg-foreground/10 rounded-md py-8" />
                            } key={update.NotificationId}>
                                <NotificationCard key={update.NotificationId} notification={update} showLocation={false} />
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
