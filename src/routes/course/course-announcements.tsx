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
import { AnimatePresence, motion } from 'framer-motion';
import useGETcourseBasic from "@/queries/courses/useGETcourseBasic";
import { RenderFetchMoreNotifications, RenderNotificationCards, RenderSkeletons } from "../notifications/notification-updates";
import NotificationsCardsFallback from "@/components/notifications/fallback/notifications-card-skeletons";
import NotificationCards from "@/components/notifications/notifications-cards";
import { FetchMoreInview } from "@/components/fetch-more-in-view";


export default function CourseAnnouncements() {
    const { id } = useParams();
    const { data: updates, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useGETcourseNotifications({
        courseId: Number(id),
        showLightBulletins: true,
        PageIndex: 0,
        PageSize: 10,
    }, {
        keepPreviousData: true,
    })

    const { data: course, isLoading: courseInfoIsLoading } = useGETcourseBasic({
        courseId: Number(id)
    })

    const { selectedUpdatesType, setSelectedUpdatesType, filteredNotifications } = useUpdatesTypeSelect(updates)

    const titleComponent = () => {
        if (courseInfoIsLoading) {
            return <Skeleton className="ml-2 rounded-md w-[500px] bg-foreground/20" />
        } else {
            return course!.Title
        }
    }

    return (
        <>
            <div
                className="sticky top-0 flex items-center justify-between gap-4 border-b bg-zinc-100/40 px-6 py-5 shadow backdrop-blur-md dark:bg-zinc-800/40">
                <h1 className="flex text-xl font-bold">Recent Updates
                    for {titleComponent()}</h1>
                <UpdatesTypeSelect update={selectedUpdatesType} onChange={setSelectedUpdatesType} />
            </div>
            <div className="p-6">
                <div className="flex flex-col gap-4">
                    {isLoading ? <NotificationsCardsFallback /> : <NotificationCards filteredNotifications={filteredNotifications} />}
                </div>
                {!isLoading && (
                    <FetchMoreInview
                        hasNextPage={hasNextPage}
                        fetchNextPage={fetchNextPage}
                        isFetchingNextPage={isFetchingNextPage}>
                        {isFetchingNextPage ? 'Fetching more notifications...' : 'End of notifications'}
                    </FetchMoreInview>
                )}
            </div>
        </>
    )
}
