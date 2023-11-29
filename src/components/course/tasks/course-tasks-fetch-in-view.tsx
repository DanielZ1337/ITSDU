import { AnimatePresence } from "framer-motion";
import { CourseTaskEmpty } from "./course-task-empty";
import { CourseTaskError } from "./course-task-error";
import { CourseTasksList } from "./course-tasks-list";
import { FetchMoreInview } from "@/components/fetch-more-in-view";

export function CourseTasksFetchInView({ tasks, completed, isError, error, hasNextPage, fetchNextPage, isFetchingNextPage }: { tasks: ItslearningRestApiEntitiesTaskDailyWorkflow[], completed?: boolean, isError?: boolean, error?: any, hasNextPage?: boolean, fetchNextPage: () => void, isFetchingNextPage?: boolean }) {

    if (isError) {
        return <CourseTaskError message={error?.message} />;
    }

    if (tasks?.length < 1) {
        return <CourseTaskEmpty />;
    }

    return (
        <AnimatePresence mode="wait">
            <CourseTasksList completed={completed} tasks={tasks} />
            {hasNextPage && (
                <FetchMoreInview
                    hasNextPage={hasNextPage}
                    fetchNextPage={fetchNextPage}
                    isFetchingNextPage={isFetchingNextPage}
                    className="py-4 text-center text-sm text-gray-600"
                >
                    {isFetchingNextPage ? 'Loading more...' : hasNextPage ? 'Load more' : ''}
                </FetchMoreInview>
            )}
        </AnimatePresence>
    );
}