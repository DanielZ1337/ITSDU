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
import { NotificationsCardsFetchMoreInView } from "@/components/notifications/notifications-cards-fetch-more-in-view";


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
            return <Skeleton className="ml-2 w-[500px] bg-foreground/20 rounded-md" />
        } else {
            return course!.Title
        }
    }

    return (
        <>
            <div
                className="py-5 sticky top-0 flex items-center gap-4 border-b px-6 bg-zinc-100/40 dark:bg-zinc-800/40 backdrop-blur-md shadow justify-between">
                <h1 className="text-xl font-bold flex">Recent Updates
                    for {titleComponent()}</h1>
                <UpdatesTypeSelect update={selectedUpdatesType} onChange={setSelectedUpdatesType} />
            </div>
            <div className="p-6">
                <div className="flex flex-col gap-4">
                    {isLoading ? <NotificationsCardsFallback /> : <NotificationCards filteredNotifications={filteredNotifications} />}
                </div>
                {!isLoading && (
                    <NotificationsCardsFetchMoreInView
                        hasNextPage={hasNextPage}
                        fetchNextPage={fetchNextPage}
                        isFetchingNextPage={isFetchingNextPage}
                    />
                )}
            </div>
        </>
    )
}
