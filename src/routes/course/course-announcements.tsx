import {lazy, memo, Suspense} from "react";
import {Skeleton} from "@nextui-org/react";
import useGETcourseNotifications from "@/queries/courses/useGETcourseNotifications";
import {useParams} from "react-router-dom";
import UpdatesTypeSelect, {useUpdatesTypeSelect} from "@/components/notifications/notifications-updates-type-select";
import useGETcourseBasic from "@/queries/courses/useGETcourseBasic";
import NotificationsCardsFallback from "@/components/notifications/fallback/notifications-card-skeletons";
import NotificationCards from "@/components/notifications/notifications-cards";
import {DEFAULT_PAGE_SIZE} from "@/lib/constants";
// import { FetchMoreInview } from "@/components/fetch-more-in-view";
const FetchMoreInViewLazy = lazy(() => import("@/components/fetch-more-in-view").then((module) => ({default: module.FetchMoreInview})));


function CourseAnnouncements() {
    const {id} = useParams();
    const {data: updates, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage} = useGETcourseNotifications({
        courseId: Number(id),
        showLightBulletins: true,
        PageIndex: 0,
        PageSize: DEFAULT_PAGE_SIZE,
    }, {
        keepPreviousData: true,
    })

    const {data: course, isLoading: courseInfoIsLoading} = useGETcourseBasic({
        courseId: Number(id)
    })

    const {selectedUpdatesType, setSelectedUpdatesType, filteredNotifications} = useUpdatesTypeSelect(updates)

    const titleComponent = () => {
        if (courseInfoIsLoading) {
            return <Skeleton className="ml-2 rounded-md w-[500px] bg-foreground/20"/>
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
                <UpdatesTypeSelect update={selectedUpdatesType} onChange={setSelectedUpdatesType}/>
            </div>
            <div className="p-6">
                <div className="flex flex-col gap-4">
                    {isLoading ? <NotificationsCardsFallback count={DEFAULT_PAGE_SIZE}/> :
                        <NotificationCards filteredNotifications={filteredNotifications}/>}
                </div>
                {!isLoading && (
                    <Suspense fallback={null}>
                        <FetchMoreInViewLazy
                            hasNextPage={hasNextPage}
                            fetchNextPage={fetchNextPage}
                            isFetchingNextPage={isFetchingNextPage}>
                            {isFetchingNextPage ? 'Fetching more notifications...' : 'End of notifications'}
                        </FetchMoreInViewLazy>
                    </Suspense>
                )}
            </div>
        </>
    )
}

export default memo(CourseAnnouncements)
