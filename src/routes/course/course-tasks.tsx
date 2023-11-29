import {useParams} from "react-router-dom";
import {AnimatePresence, m} from 'framer-motion';
import useGETcourseTasklistDailyWorkflowCompleted from "@/queries/courses/useGETcourseTasklistDailyWorkflowCompleted";
import {Badge} from "@/components/ui/badge";
import {FetchMoreInview} from "@/components/fetch-more-in-view";
import TasksCardSkeletons from "@/components/course/tasks/fallback/tasks-card-skeletons";

export default function CourseTasks() {
    const {id} = useParams()
    const courseId = Number(id)

    return (
        <div className="h-full overflow-y-auto overflow-x-hidden p-4">
            <CompletedCourseTasks courseId={courseId}/>
        </div>
    )
}

function CompletedCourseTasks({courseId}: { courseId: number }) {

    // itslearning api doesn't support pagination for this endpoint even though they say it does so this tricks Tanstack Query into thinking it doesn't have anymore pages based on the page size, total and page index
    const PAGE_SIZE = 9999
    const {
        data,
        isError,
        isLoading,
        error,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage
    } = useGETcourseTasklistDailyWorkflowCompleted({
        courseId,
        PageIndex: 1,
        // itslearning api doesn't support pagination for this endpoint even though they say it does so this tricks Tanstack Query into thinking it doesn't have anymore pages based on the page size, total and page index
        PageSize: PAGE_SIZE,
    })

    data?.pages.sort((a, b) => {
        a.EntityArray.sort((a, b) => {
            return b.TaskId - a.TaskId
        })

        b.EntityArray.sort((a, b) => {
            return b.TaskId - a.TaskId
        })

        return b.EntityArray[0].TaskId - a.EntityArray[0].TaskId
    })

    if (isError) {
        return (
            <div className="flex flex-1 flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold">Error</h1>
                <p className="text-gray-600">{error?.message}</p>
            </div>
        )
    }

    if (data?.pages[0].EntityArray.length === 0) {
        return (
            <div className="flex flex-1 flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold">No tasks</h1>
                <p className="text-gray-600">You have no tasks in this course.</p>
            </div>
        )
    }

    return (
        <AnimatePresence mode="wait">
            {isLoading ?
                <m.div
                    key={'tasks-skeletons'}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: 20}}
                    className="mx-auto grid h-fit w-full grid-cols-1 gap-4 lg:grid-cols-2"
                >
                    <TasksCardSkeletons count={10}/>
                </m.div>
                : <m.div
                    key={'tasks'}
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: 20}}
                    transition={{duration: 0.5}}
                    className="mx-auto grid h-fit w-full grid-cols-1 gap-4 lg:grid-cols-2"
                >
                    {data?.pages.map((page) => (
                        page.EntityArray.map((task, i) => (
                            <m.div
                                key={task.TaskId}
                                initial={{opacity: 0, y: 20}}
                                animate={{opacity: 1, y: 0}}
                                transition={{duration: 0.5, delay: 0.1 * i}}
                                className="overflow-hidden rounded-md p-6 shadow bg-foreground/10"
                            >

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center overflow-hidden space-x-2">
                                        <img
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
                                    <Badge variant={'success'}>
                                        Completed
                                    </Badge>
                                </div>
                                <p className="mt-2 text-gray-700 dark:text-gray-300">{task.CourseTitle}</p>
                                {/* {task.Deadline && (
                            <p className="text-gray-600">
                                Deadline: {new Date(task.Deadline).toLocaleDateString()}
                            </p>
                        )} */}
                            </m.div>
                        ))
                    ))}
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
                </m.div>
            }
        </AnimatePresence>
    )
}
