import { CourseTasksSkeletonsAnimated } from "@/components/course/tasks/fallback/course-tasks-card-skeletons-animated";
import useGETcoursePlans from "@/queries/courses/useGETcoursePlans";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, m } from 'framer-motion';
import { Fragment, Suspense, useEffect, useState } from "react";
import useGETcoursePlansScraped from "@/queries/extra/useGETcoursePlansScraped";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import useGETcoursePlanElements from "@/queries/extra/useGETcoursePlanElements";
import { Loader } from "@/components/ui/loader";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, MoreVertical } from "lucide-react";
import { isSupportedResourceInApp, useNavigateToResource } from "@/types/api-types/extra/learning-tool-id-types";
import { CoursePlansSkeletonsAnimated } from "@/components/course/plans/course-plans-card-skeletons-animated";

export default function CoursePlans() {
    const { id } = useParams();
    const courseId = Number(id);
    const { data, isLoading } = useGETcoursePlansScraped(courseId)

    return (
        <div className="grid items-start gap-6 p-4 text-sm font-medium">
            <AnimatePresence mode="wait">
                {isLoading ? (
                    <CoursePlansSkeletonsAnimated PageSize={10} />
                ) : (
                    <m.div className="flex flex-col gap-4"
                        key={"plans"}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        layout
                    >
                        {data?.map((plan, index) => (
                            <m.div
                                key={index}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="w-full border rounded-md p-4 bg-foreground/10"
                                layout
                            >
                                <Accordion type="single" collapsible>
                                    <AccordionItem className="border-none" value={String(plan.dataTopicId)}>
                                        <AccordionTrigger className="px-4 group hover:no-underline py-0 w-fit text-lg font-semibold ">
                                            <span className="flex flex-col">
                                                <span className="text-left group-hover:underline">
                                                    {plan.planTitle}
                                                </span>
                                                {plan.fromDate && plan.toDate && (
                                                    <span className="text-sm text-gray-500 mt-1 hover:no-underline">
                                                        {new Date(plan.fromDate).toDateString()} - {new Date(plan.toDate).toDateString()}
                                                    </span>
                                                )}
                                            </span>
                                        </AccordionTrigger>
                                        <AccordionContent
                                            className="mt-4"
                                        >
                                            <Suspense fallback={<Loader className="m-auto" />}>
                                                <m.div
                                                    initial={{ opacity: 0, y: -20, height: 0 }}
                                                    animate={{ opacity: 1, y: 0, height: "auto" }}
                                                    transition={{ delay: 0.2 }}
                                                    layout
                                                >
                                                    <CoursePlanElements courseId={courseId} topicId={plan.dataTopicId} />
                                                </m.div>
                                            </Suspense>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </m.div>
                        ))}

                    </m.div>
                )}
            </AnimatePresence>
        </div >
    )
}

function CoursePlanElements({ courseId, topicId }: { courseId: number | string, topicId: number | string }) {
    const { data } = useGETcoursePlanElements(courseId, topicId, {
        suspense: true,
    })

    const navigate = useNavigate()
    const navigateToResource = useNavigateToResource(navigate)

    return (
        <div className="flex flex-col gap-4 border-t-2 border-foreground/20">
            {data?.map((element, index) => (
                <Fragment key={index}>
                    <div className="p-4">
                        <h3 className="text-lg font-semibold mb-2">
                            {element.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                            {new Date(element.date.from!).toDateString()} - {new Date(element.date.to!).toDateString()}
                        </p>
                        <p className="mt-2 whitespace-pre-wrap">{element.description}</p>
                        <div className="mt-4">
                            <ul
                                className="grid grid-cols-1 gap-2"
                                style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 30fr))" }}
                            >
                                {element.resourcesAndActivities.map((resource, resIndex) => (
                                    <li key={resIndex} className="hover:cursor-pointer">
                                        <span
                                            className="flex items-center gap-2"
                                        >
                                            <img
                                                className="inline-block w-6 h-6 mr-2 shrink-0"
                                                src={resource.img} alt={resource.title} />
                                            <a
                                                className="text-blue-500 hover:underline truncate"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={async (e) => {
                                                    e.preventDefault()
                                                    if (isSupportedResourceInApp({
                                                        ElementId: resource.elementId,
                                                        IconUrl: resource.img,
                                                        Title: resource.title,
                                                        Url: resource.link,
                                                    })) {
                                                        navigateToResource({
                                                            ElementId: resource.elementId,
                                                            IconUrl: resource.img!,
                                                            Title: resource.title!,
                                                            Url: resource.link!,
                                                        })
                                                    } else {
                                                        await window.app.openExternal(`https://sdu.itslearning.com${resource.link}`, true)
                                                    }
                                                }}
                                            >
                                                {resource.title}
                                            </a>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger className="flex items-center">
                                                    <Button size="icon" variant="ghost" className="w-6 h-6 hover:bg-foreground/10 ">
                                                        <MoreHorizontal
                                                            className="w-4 h-4"
                                                        />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className="bg-foreground-50">
                                                    <DropdownMenuItem asChild className="block flex-none">
                                                        <a
                                                            className="text-center "
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            onClick={(e) => {
                                                                e.preventDefault()
                                                                navigate(`/courses/${courseId}/resources/${resource.parentFolder}`)
                                                            }}
                                                        >
                                                            Go to Folder
                                                        </a>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    {data.length - 1 !== index && <div className={"h-[2px] w-full bg-foreground/20 rounded-full"} />}
                </Fragment>
            ))}
        </div>
    )
}