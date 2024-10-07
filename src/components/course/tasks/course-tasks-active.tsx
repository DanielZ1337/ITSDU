import { Badge } from "@/components/ui/badge";
import { ITSLEARNING_API_MAX_PAGESIZE } from "@/lib/utils";
import useGETcourseTasklistDailyWorkflow from "@/queries/courses/useGETcourseTasklistDailyWorkflow";
import { m } from "framer-motion";
import { useMemo } from "react";
import { CourseTasksFetchInView } from "./course-tasks-fetch-in-view";
import { CourseTasksSkeletonsAnimated } from "./fallback/course-tasks-card-skeletons-animated";
import { GETssoUrlApiUrl } from "@/types/api-types/sso/GETssoUrl";
import { useNavigate } from "react-router-dom";
import useGETcourseTasklistDailyWorkflowViewas from "@/queries/courses/useGETcourseTasklistDailyWorkflowViewas";

export function CourseTasksActive({
  courseId,
  PageSize,
}: {
  courseId: number;
  PageSize: ITSLEARNING_API_MAX_PAGESIZE;
}) {
  const {
    data,
    isLoading,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGETcourseTasklistDailyWorkflowViewas({
    courseId,
    PageIndex: 0,
    PageSize: PageSize,
  });

  const isEmpty =
    data?.pages[0].EntityArray.length !== undefined &&
    data?.pages[0].EntityArray.length < 1;

  const tasksFlatMapMemoed = useMemo(
    () => data?.pages.flatMap((page) => page.EntityArray),
    [data],
  );

  const tasksFlatMap = tasksFlatMapMemoed?.flatMap(
    (tasks) => tasks.TaskDailyWorkflow.EntityArray,
  );

  const completed = false;

  const navigate = useNavigate();

  const handleTaskClick = (taskUrl: string) => {
    const url = new URL(taskUrl, "https://sdu.itslearning.com");
    navigate(`/sso?url=${url.toString()}`);
  };

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
        <>
          {tasksFlatMapMemoed?.map((taskSection, i) => (
            <m.div
              key={`${taskSection.SectionTitle}-${i}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-bold">
                  {taskSection.SectionTitle}
                </h2>
                <div className="flex flex-col gap-2">
                  <m.div
                    key={"tasks-active"}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.2 }}
                    className="mx-auto grid h-fit w-full grid-cols-1 gap-4 lg:grid-cols-2"
                  >
                    {taskSection.TaskDailyWorkflow.EntityArray?.map(
                      (task, i) => (
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
                                onClick={() => handleTaskClick(task.TaskUrl)}
                                href={task.TaskUrl}
                                rel="noopener noreferrer"
                                target="_blank"
                                className="mt-2 block truncate text-blue-500 hover:underline"
                              >
                                <h3 className="truncate text-lg font-semibold">
                                  {task.TaskTitle}
                                </h3>
                              </a>
                            </div>
                            <Badge variant={completed ? "success" : "outline"}>
                              {completed ? "Completed" : "Active"}
                            </Badge>
                          </div>
                          <p className="mt-2 text-gray-700 dark:text-gray-300">
                            {task.CourseTitle}
                          </p>
                          {task.Deadline && (
                            <p className="text-muted-foreground">
                              Deadline:{" "}
                              {new Date(task.Deadline).toLocaleString()}
                            </p>
                          )}
                        </m.div>
                      ),
                    )}
                  </m.div>
                </div>
              </div>
            </m.div>
          ))}
        </>
      )}
    </CourseTasksFetchInView>
  );
}
