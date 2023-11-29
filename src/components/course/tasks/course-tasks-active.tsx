import useGETcourseTasklistDailyWorkflow from "@/queries/courses/useGETcourseTasklistDailyWorkflow";
import { CourseTaskEmpty } from "./course-task-empty";
import { CourseTasksFetchInView } from "./course-tasks-fetch-in-view";

export function CourseTasksActive({ courseId, TASKS_PAGE_SIZE }: {
    courseId: number,
    TASKS_PAGE_SIZE: number
}) {
    const {
        data,
        isError,
        error,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage
    } = useGETcourseTasklistDailyWorkflow({
        courseId,
        PageIndex: 0,
        PageSize: TASKS_PAGE_SIZE,
    }, {
        suspense: true,
    });


    if (data && data?.pages[0].EntityArray.length < 1) {
        return <CourseTaskEmpty />
    }


    return (
        data?.pages.map(page => (
            page.EntityArray.map(task => (
                <CourseTasksFetchInView
                    tasks={task.TaskDailyWorkflow.EntityArray}
                    completed={false}
                    isError={isError}
                    error={error}
                    hasNextPage={hasNextPage}
                    fetchNextPage={fetchNextPage}
                    isFetchingNextPage={isFetchingNextPage}
                />
            ))
        ))
    )
}