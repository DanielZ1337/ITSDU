import useGETcourseTasklistDailyWorkflowCompleted from "@/queries/courses/useGETcourseTasklistDailyWorkflowCompleted";
import { CourseTasksFetchInView } from "./course-tasks-fetch-in-view";
import { CourseTaskEmpty } from "./course-task-empty";

export function CourseTasksCompleted({ courseId, TASKS_PAGE_SIZE }: { courseId: number, TASKS_PAGE_SIZE: number }) {
    const {
        data,
        isError,
        error,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage
    } = useGETcourseTasklistDailyWorkflowCompleted({
        courseId,
        PageIndex: 1,
        PageSize: TASKS_PAGE_SIZE,
    }, {
        suspense: true,
    });

    if (data && data?.pages[0].EntityArray.length < 1) {
        return <CourseTaskEmpty />;
    }

    return data?.pages.map((page) => (
        <CourseTasksFetchInView
            tasks={page.EntityArray!}
            completed={true}
            isError={isError}
            error={error}
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
            isFetchingNextPage={isFetchingNextPage}
        />
    ))
}