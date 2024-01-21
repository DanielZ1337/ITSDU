import { Badge } from '@/components/ui/badge';
import { ItslearningRestApiEntitiesTaskDailyWorkflow } from '@/types/api-types/utils/Itslearning.RestApi.Entities.TaskDailyWorkflow';
import { m } from 'framer-motion';

export function CourseTaskCard({ task, completed, index }: { task: ItslearningRestApiEntitiesTaskDailyWorkflow, completed?: boolean, index?: number }) {
    return (
        <m.div
            key={task.TaskId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index ? index * 0.1 : 0 }}
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
    );
}
