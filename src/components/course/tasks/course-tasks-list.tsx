import {CourseTaskCard} from "./course-task-card";
import {m} from 'framer-motion';
import {
    ItslearningRestApiEntitiesTaskDailyWorkflow
} from '../../../types/api-types/utils/Itslearning.RestApi.Entities.TaskDailyWorkflow';

export function CourseTasksList({tasks, completed}: {
    tasks: ItslearningRestApiEntitiesTaskDailyWorkflow[],
    completed?: boolean
}) {
    return (
        <m.div
            key={'tasks'}
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: 20}}
            transition={{duration: 0.2}}
            className="mx-auto grid h-fit w-full grid-cols-1 gap-4 lg:grid-cols-2"
        >
            {tasks.map((task, i) => (
                <CourseTaskCard completed={completed} task={task} index={i} key={i}/>
            ))}
        </m.div>
    );
}