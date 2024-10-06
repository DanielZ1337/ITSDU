import NotificationsCardsFallback from "@/components/notifications/fallback/notifications-card-skeletons";
import NotificationCards from "@/components/notifications/notifications-cards";
import UpdatesTypeSelect, {
  useUpdatesTypeSelect,
} from "@/components/notifications/notifications-updates-type-select";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import useGETcourseBasic from "@/queries/courses/useGETcourseBasic";
import useGETcourseNotifications from "@/queries/courses/useGETcourseNotifications";
import { Skeleton } from "@nextui-org/react";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense, lazy, memo } from "react";
const FetchMoreInViewLazy = lazy(() =>
  import("@/components/fetch-more-in-view").then((module) => ({
    default: module.FetchMoreInview,
  })),
);

export const Route = createFileRoute("/courses/$id/updates")({
  component: () => <div>Hello /courses/updates!</div>,
});

function CourseAnnouncements() {
  const { id } = Route.useParams();
  const {
    data: updates,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGETcourseNotifications(
    {
      courseId: Number(id),
      showLightBulletins: true,
      PageIndex: 0,
      PageSize: DEFAULT_PAGE_SIZE,
    },
    {
      keepPreviousData: true,
    },
  );

  const { data: course } = useGETcourseBasic({
    courseId: Number(id),
  });

  const { selectedUpdatesType, setSelectedUpdatesType, filteredNotifications } =
    useUpdatesTypeSelect(updates);

  return (
    <>
      <div className="sticky top-0 flex items-center justify-between gap-4 border-b bg-zinc-100/40 px-6 py-5 shadow backdrop-blur-md dark:bg-zinc-800/40">
        <h1 className="flex text-xl font-bold">
          Recent Updates for{" "}
          {course ? (
            course.Title
          ) : (
            <Skeleton className="ml-2 rounded-md w-[500px] bg-foreground/20" />
          )}
        </h1>
        <UpdatesTypeSelect
          update={selectedUpdatesType}
          onChange={setSelectedUpdatesType}
        />
      </div>
      <div className="p-6">
        <div className="flex flex-col gap-4">
          {isLoading ? (
            <NotificationsCardsFallback count={DEFAULT_PAGE_SIZE} />
          ) : (
            <NotificationCards filteredNotifications={filteredNotifications} />
          )}
        </div>
        {!isLoading && (
          <Suspense fallback={null}>
            <FetchMoreInViewLazy
              hasNextPage={hasNextPage}
              fetchNextPage={fetchNextPage}
              isFetchingNextPage={isFetchingNextPage}
            >
              {isFetchingNextPage
                ? "Fetching more notifications..."
                : "End of notifications"}
            </FetchMoreInViewLazy>
          </Suspense>
        )}
      </div>
    </>
  );
}

export default memo(CourseAnnouncements);
