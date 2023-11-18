import { Suspense, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Skeleton } from "@nextui-org/react";
import NotificationCard from "@/components/notifications/notifications-card";
import useGETcourseNotifications from "@/queries/courses/useGETcourseNotifications";
import { useParams } from "react-router-dom";


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

    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, fetchNextPage]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Recent Updates
                for {updates?.pages[0].EntityArray[0].LocationTitle}</h1>
            <div className="flex flex-col gap-4">
                {updates && updates.pages.map((page) => (
                    page.EntityArray.map((update) => (
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
    )
}
