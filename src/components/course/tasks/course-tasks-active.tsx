import useGETcourseTasklistDailyWorkflow from "@/queries/courses/useGETcourseTasklistDailyWorkflow";
import { CourseTaskEmpty } from "./course-task-empty";
import { CourseTasksFetchInView } from "./course-tasks-fetch-in-view";
import { AnimatePresence, m } from 'framer-motion';
import { CourseTasksSkeletonsAnimated } from "./fallback/course-tasks-card-skeletons-animated";
import { CourseTasksList } from "./course-tasks-list";
import { FetchMoreInview } from "@/components/fetch-more-in-view";
import { CourseTaskCard } from "./course-task-card";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { ITSLEARNING_API_MAX_PAGESIZE, NumericRange } from "@/lib/utils";

export function CourseTasksActive({ courseId, PageSize }: { courseId: number, PageSize: ITSLEARNING_API_MAX_PAGESIZE }) {
    const {
        data,
        isLoading,
        isError,
        error,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage
    } = useGETcourseTasklistDailyWorkflow({
        courseId,
        PageIndex: 0,
        PageSize: PageSize,
    });

    const isEmpty = data?.pages[0].EntityArray.length !== undefined && data?.pages[0].EntityArray.length < 1

    const tasksFlatMapMemoed = useMemo(() => data?.pages.flatMap(page => page.EntityArray), [data])

    const tasksFlatMap = tasksFlatMapMemoed?.flatMap(tasks => tasks.TaskDailyWorkflow.EntityArray)

    const completed = false

    return (
        <CourseTasksFetchInView
            key={'tasks-active'}
            length={data?.pages[0].EntityArray.length}
            isError={isError}
            error={error}
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
            isFetchingNextPage={isFetchingNextPage}>
            {isLoading ? (
                <CourseTasksSkeletonsAnimated key={"skeletons"} PageSize={PageSize} />
            ) : (
                <m.div
                    key={'tasks-active'}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.2 }}
                    className="mx-auto grid h-fit w-full grid-cols-1 gap-4 lg:grid-cols-2"
                >
                    {tasksFlatMap?.map((task, i) => (
                        <m.div
                            key={task.TaskId}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: i ? i * 0.1 : 0 }}
                            className="overflow-hidden rounded-md p-6 shadow bg-foreground/10"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center overflow-hidden space-x-2">
                                    <img loading="lazy" src={task.IconUrl} alt="Task Icon" className="h-6 w-6 object-contain" />
                                    <a href={task.TaskUrl} rel="noopener noreferrer" target="_blank" className="mt-2 block truncate text-blue-500 hover:underline">
                                        <h3 className="truncate text-lg font-semibold">{task.TaskTitle}</h3>
                                    </a>
                                </div>
                                <Badge variant={completed ? 'success' : 'outline'}>{completed ? 'Completed' : 'Active'}</Badge>
                            </div>
                            <p className="mt-2 text-gray-700 dark:text-gray-300">{task.CourseTitle}</p>
                            {task.DeadlineDisplayTime && (
                                <p className="text-gray-600">Deadline: {task.DeadlineDisplayTime}</p>
                            )}
                        </m.div>
                    ))}
                </m.div>
            )}
        </CourseTasksFetchInView>
    )
}