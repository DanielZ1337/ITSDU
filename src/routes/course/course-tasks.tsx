import { useParams } from "react-router-dom";
import { AnimatePresence, m, useCycle, motion } from 'framer-motion';
import useGETcourseTasklistDailyWorkflowCompleted from "@/queries/courses/useGETcourseTasklistDailyWorkflowCompleted";
import { Badge } from "@/components/ui/badge";
import { FetchMoreInview } from "@/components/fetch-more-in-view";
import CourseTasksCardSkeletons from "@/components/course/tasks/fallback/course-tasks-card-skeletons";
import useGETcourseTasklistDailyWorkflow from "@/queries/courses/useGETcourseTasklistDailyWorkflow";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ItslearningRestApiEntitiesTaskDailyWorkflow } from "@/types/api-types/utils/Itslearning.RestApi.Entities.TaskDailyWorkflow";
import { Suspense } from "react";
import { CourseTaskTabButton } from "@/components/course/tasks/course-task-tab-button";
import { CourseTasksSkeletonsAnimated } from "@/components/course/tasks/fallback/course-tasks-card-skeletons-animated";
import { CourseTasksActive } from "@/components/course/tasks/course-tasks-active";
import { CourseTasksCompleted } from "@/components/course/tasks/course-tasks-completed";

const TASKS_PAGE_SIZE = 9999

export default function CourseTasks() {
    const { id } = useParams()
    const courseId = Number(id)

    const [activeTab, cycleTab] = useCycle('active', 'completed');

    const handleTabClick = () => {
        cycleTab();
    };

    return (
        <div className="h-full overflow-y-auto overflow-x-hidden p-4"
            style={{
                scrollbarGutter: 'stable both-edges'
            }}
        >
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Tasks</h1>
                <div className="flex items-center gap-4">
                    <CourseTaskTabButton active={activeTab === 'active'} onClick={handleTabClick}>Active</CourseTaskTabButton>
                    <CourseTaskTabButton active={activeTab === 'completed'} onClick={handleTabClick}>Completed</CourseTaskTabButton>
                </div>
            </div>
            <div className="mt-4">
                <Suspense fallback={<CourseTasksSkeletonsAnimated PageSize={TASKS_PAGE_SIZE} />}>
                    {activeTab === 'active' ? <CourseTasksActive TASKS_PAGE_SIZE={TASKS_PAGE_SIZE} courseId={courseId} /> : <CourseTasksCompleted TASKS_PAGE_SIZE={TASKS_PAGE_SIZE} courseId={courseId} />}
                </Suspense>
            </div>
        </div>
    )
}








