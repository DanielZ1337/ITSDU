import { CourseTasksSkeletonsAnimated } from "@/components/course/tasks/fallback/course-tasks-card-skeletons-animated";
import useGETcoursePlans from "@/queries/courses/useGETcoursePlans";
import { useParams } from "react-router-dom";
import { AnimatePresence, m } from 'framer-motion';
import { Suspense, useEffect, useState } from "react";
import useGETcoursePlansScraped from "@/queries/extra/useGETcoursePlansScraped";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import useGETcoursePlanElements from "@/queries/extra/useGETcoursePlanElements";
import { Loader } from "@/components/ui/loader";

export default function CoursePlans() {
    const { id } = useParams();
    const courseId = Number(id);
    const { data, isLoading } = useGETcoursePlansScraped(courseId)

    return (
        <div className="grid items-start gap-6 p-4 text-sm font-medium">
            <AnimatePresence mode="wait">
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
                        {data?.map((plan, i) => (
                            <m.div
                                key={plan.dataTopicId}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2, delay: i ? i * 0.1 : 0 }}
                                className="overflow-hidden rounded-md p-6 shadow bg-foreground/10"
                            >

                                <Accordion type="single" collapsible>
                                    <AccordionItem value={plan.dataTopicId}>
                                        <AccordionTrigger className="hover:no-underline">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center overflow-hidden space-x-2">
                                                    <a onClick={(e) => { e.stopPropagation() }}
                                                        href={`https://sdu.itslearning.com/Planner/Planner.aspx?CourseID=${courseId}&filter=t${plan.dataTopicId}`} rel="noopener noreferrer" target="_blank" className="mt-2 block truncate text-blue-500 hover:underline">
                                                        <h3 className="truncate text-lg font-semibold">{plan.courseTitle}</h3>
                                                    </a>
                                                </div>
                                            </div>
                                            {plan.fromDate && (
                                                <p className="text-gray-600">Start: {new Date(plan.fromDate).toLocaleDateString()}</p>
                                            )}

                                            {plan.toDate && (
                                                <p className="text-gray-600">End: {new Date(plan.toDate).toLocaleDateString()}</p>
                                            )}
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <Suspense fallback={<div className="flex h-full items-center justify-center">
                                                <Loader className={"m-auto"} /></div>}>
                                                <AnimatePresence>
                                                    <CoursePlanElements courseId={courseId} topicId={plan.dataTopicId} />
                                                </AnimatePresence>
                                            </Suspense>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </m.div>
                        ))}
                    </m.div>
                )}
            </AnimatePresence>
        </div>
    )
}


/**
 * 
 * type ResponseObject = {
    title: string
    date: {
        from: Date | null
        to: Date | null
    }
    description: string
    resourcesAndActivities: ResourceActivityObject[]
}

type ResourceActivityObject = {
    planId: string
    elementId: string
    link: string
    title: string
}
 */
function CoursePlanElements({ courseId, topicId }: { courseId: number | string, topicId: number | string }) {
    const { data } = useGETcoursePlanElements(courseId, topicId, {
        suspense: true,
    })

    return (
        <div className="grid items-start gap-6 p-4 text-sm font-medium">
            <AnimatePresence>
                {data?.map((plan, i) => (
                    <m.div
                        key={plan.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: i ? i * 0.1 : 0 }}
                        className="overflow-hidden rounded-md p-6 shadow bg-foreground/10"
                    >
                        <a onClick={(e) => { e.stopPropagation() }}
                            href={`https://sdu.itslearning.com/Planner/Planner.aspx?CourseID=${courseId}&filter=t${topicId}`} rel="noopener noreferrer" target="_blank" className="mt-2 block truncate text-blue-500 hover:underline">
                            <h3 className="truncate text-lg font-semibold">{plan.title}</h3>
                        </a>
                        {plan.date.from && (
                            <p className="text-gray-600">Start: {new Date(plan.date.from).toLocaleDateString(undefined, {
                                hour: "numeric",
                                minute: "numeric"
                            })}</p>
                        )}

                        {plan.date.to && (
                            <p className="text-gray-600">End: {new Date(plan.date.to).toLocaleDateString(undefined, {
                                hour: "numeric",
                                minute: "numeric"
                            })}</p>
                        )}
                        {plan.description && (
                            <p className="text-gray-600 whitespace-pre-wrap">Description: {plan.description}</p>
                        )}
                        <div className="flex flex-col gap-2">
                            {plan.resourcesAndActivities.map((resource) => (
                                <a
                                    key={resource.elementId}
                                    onClick={(e) => { e.stopPropagation() }}
                                    href={resource.link} rel="noopener noreferrer" target="_blank" className="mt-2 block truncate text-blue-500 hover:underline">
                                    <h3 className="truncate text-lg font-semibold">{resource.title}</h3>
                                </a>
                            ))}
                        </div>
                    </m.div>
                ))}
            </AnimatePresence>
        </div>
    )
}