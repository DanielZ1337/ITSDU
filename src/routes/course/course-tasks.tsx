import useGETcourseTasklistDailyWorkflow from "@/queries/courses/useGETcourseTasklistDailyWorkflow.ts";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { motion, useCycle } from 'framer-motion';

export default function CourseTasks() {
    const { id } = useParams()
    const courseId = Number(id)
    const { data, isError, isLoading, error } = useGETcourseTasklistDailyWorkflow({
        courseId,
        PageIndex: 0,
        PageSize: 100,
    }, {
        suspense: true,
    })

    const [activeTab, setActiveTab] = useState('active'); // 'active' or 'completed'
    const filteredTasks = data?.EntityArray[0].TaskDailyWorkflow.EntityArray.filter(
        (task) =>
            (activeTab === 'active' && task.Status !== 'Completed') ||
            (activeTab === 'completed' && task.Status === 'Completed')
    );

    const tabVariants = {
        // The active tab is the one we want to animate to with x, y, opacity, colors, etc.
        active: {
            color: '#fff',
            backgroundColor: '#2563EB',
            scale: 1.05,
            borderRadius: '0.375rem',
        },
        // The inactive tab is the one we want to animate away from with x, y, opacity, colors, etc.
        inactive: {
            color: '#374151',
            backgroundColor: '#E5E7EB',
            scale: 1,
            borderRadius: '0.375rem',
        },
    };

    const [tabAnimation, cycleTabAnimation] = useCycle('active', 'inactive');

    console.log(data)

    return (
        <div className="max-w-3xl mx-auto p-4 dark:bg-gray-800">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex justify-center items-center space-x-4"
            >
                <motion.button
                    onClick={() => {
                        setActiveTab('active');
                        cycleTabAnimation();
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    variants={tabVariants}
                    animate={tabAnimation}
                    className="py-2 px-4 rounded"
                >
                    Active
                </motion.button>
                <motion.button
                    onClick={() => {
                        setActiveTab('completed');
                        cycleTabAnimation();
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    variants={tabVariants}
                    animate={tabAnimation}
                    className="py-2 px-4 rounded"
                >
                    Completed
                </motion.button>
            </motion.div>
            <div className="mt-4">
                {isLoading ? (
                    <p className="text-center">Loading...</p>
                ) : isError ? (
                    <p className="text-center text-red-500">{error.message}</p>
                ) : filteredTasks.length > 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {filteredTasks.map((task) => (
                            <motion.div
                                key={task.TaskId}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="bg-white dark:bg-gray-700 rounded shadow p-4 mb-4"
                            >
                                <div
                                    key={task.TaskId}
                                    className="bg-white dark:bg-gray-700 rounded shadow p-4 mb-4"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <img
                                                src={task.IconUrl}
                                                alt="Task Icon"
                                                className="w-6 h-6 object-contain"
                                            />
                                            <h3 className="text-lg font-semibold">{task.TaskTitle}</h3>
                                        </div>
                                        <span
                                            className={`px-2 py-1 rounded ${task.Status === 'Completed'
                                                ? 'bg-green-500 text-white'
                                                : 'bg-gray-300 text-gray-700 dark:bg-gray-600 dark:text-gray-300'
                                                }`}
                                        >
                                            {task.Status === 'Completed' ? 'Completed' : 'Active'}
                                        </span>
                                    </div>
                                    <p className="text-gray-600">{task.CourseTitle}</p>
                                    {task.Deadline && (
                                        <p className="text-gray-600">
                                            Deadline: {new Date(task.Deadline).toLocaleDateString()}
                                        </p>
                                    )}
                                    <a
                                        href={task.TaskUrl}
                                        target={task.TaskUrlTarget}
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:underline block mt-2"
                                    >
                                        View Task
                                    </a>
                                    {/* Add additional task details as needed */}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <p className="text-center text-gray-600">
                        No {activeTab === 'active' ? 'active' : 'completed'} tasks found.
                    </p>
                )}
            </div>
        </div>
    )
}