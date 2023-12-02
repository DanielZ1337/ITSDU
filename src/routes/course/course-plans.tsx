import { CourseTasksSkeletonsAnimated } from "@/components/course/tasks/fallback/course-tasks-card-skeletons-animated";
import useGETcoursePlans from "@/queries/courses/useGETcoursePlans";
import { useParams } from "react-router-dom";
import { AnimatePresence, m } from 'framer-motion';
import { useEffect, useState } from "react";

export default function CoursePlans() {
    const { id } = useParams();
    const courseId = Number(id);
    const { data, isLoading } = useGETcoursePlans({
        courseId: courseId,
    })

    const [coursePlans, setCoursePlans] = useState<object[]>([])

    useEffect(() => {
        const getCoursePlans = async () => {
            const coursePlans = await window.resources.coursePlans.get(courseId)

            setCoursePlans(coursePlans)
        }

        getCoursePlans()
    }, [])

    return (
        <div className="grid items-start gap-6 p-4 text-sm font-medium">
            <pre>
                {JSON.stringify(coursePlans, null, 2)}
            </pre>
            {/* <AnimatePresence mode="wait">
                {isLoading ? (
                    <CourseTasksSkeletonsAnimated key={"skeletons"} PageSize={10} />
                ) : (
                    <m.div
                        key={'tasks-active'}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="mx-auto grid h-fit w-full grid-cols-1 gap-4 lg:grid-cols-2"
                    >
                        {data?.EntityArray?.map((plan, i) => (
                            <m.div
                                key={plan.PlanId}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2, delay: i ? i * 0.1 : 0 }}
                                className="overflow-hidden rounded-md p-6 shadow bg-foreground/10"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center overflow-hidden space-x-2">
                                        <a href={''} rel="noopener noreferrer" target="_blank" className="mt-2 block truncate text-blue-500 hover:underline">
                                            <h3 className="truncate text-lg font-semibold">{plan.PlanName}</h3>
                                            <h4 className="truncate text-sm font-medium text-gray-600">{plan.TopicId}</h4>
                                        </a>
                                    </div>
                                </div>
                                <p className="mt-2 text-gray-700 dark:text-gray-300">
                                    <div dangerouslySetInnerHTML={{ __html: plan.PlanDescription }} />
                                </p>
                                {plan.Start && (
                                    <p className="text-gray-600">Start: {new Date(plan.Start).toLocaleDateString()}</p>
                                )}

                                {plan.Stop && (
                                    <p className="text-gray-600">Stop: {new Date(plan.Stop).toLocaleDateString()}</p>
                                )}
                            </m.div>
                        ))}
                    </m.div>
                )}
            </AnimatePresence> */}
        </div>
    )
}
