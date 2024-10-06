import { Badge } from "@/components/ui/badge";
import useGETcourseTasklistDailyWorkflowCompleted from "@/queries/courses/useGETcourseTasklistDailyWorkflowCompleted";
import { m } from "framer-motion";
import { CourseTasksFetchInView } from "./course-tasks-fetch-in-view";
import { CourseTasksSkeletonsAnimated } from "./fallback/course-tasks-card-skeletons-animated";

export function CourseTasksCompleted({
  courseId,
  PageSize,
}: { courseId: number; PageSize: number }) {
  const {
    data,
    isError,
    error,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGETcourseTasklistDailyWorkflowCompleted({
    courseId,
    PageIndex: 1,
    // disable the paramter, as itslearning says it is supported but it is not
    PageSize: 100,
  });

  const isEmpty =
    data?.pages[0].EntityArray.length !== undefined &&
    data?.pages[0].EntityArray.length < 1;

  const completed = true;

  return (
    <CourseTasksFetchInView
      key={"tasks-active"}
      length={data?.pages[0].EntityArray.length}
      isError={isError}
      error={error}
      hasNextPage={hasNextPage}
      fetchNextPage={fetchNextPage}
      isFetchingNextPage={isFetchingNextPage}
    >
      {isLoading ? (
        <CourseTasksSkeletonsAnimated key={"skeletons"} PageSize={PageSize} />
      ) : (
        <m.div
          key={"tasks-active"}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          className="mx-auto grid h-fit w-full grid-cols-1 gap-4 lg:grid-cols-2"
        >
          {data?.pages.map((page) =>
            page.EntityArray.map((task, i) => (
              <m.div
                key={task.TaskId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i ? i * 0.1 : 0 }}
                className="overflow-hidden rounded-md p-6 shadow bg-foreground/10"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center overflow-hidden space-x-2">
                    <img
                      loading="lazy"
                      src={task.IconUrl}
                      alt="Task Icon"
                      className="h-6 w-6 object-contain"
                    />
                    <a
                      href={task.TaskUrl}
                      rel="noopener noreferrer"
                      target="_blank"
                      className="mt-2 block truncate text-blue-500 hover:underline"
                    >
                      <h3 className="truncate text-lg font-semibold">{task.TaskTitle}</h3>
                    </a>
                  </div>
                  <Badge variant={completed ? "success" : "outline"}>
                    {completed ? "Completed" : "Active"}
                  </Badge>
                </div>
                <p className="mt-2 text-gray-700 dark:text-gray-300">
                  {task.CourseTitle}
                </p>
                {task.DeadlineDisplayTime && (
                  <p className="text-gray-600">Deadline: {task.DeadlineDisplayTime}</p>
                )}
              </m.div>
            )),
          )}
        </m.div>
      )}
    </CourseTasksFetchInView>
  );
}
