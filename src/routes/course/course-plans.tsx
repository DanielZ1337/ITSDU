import { CourseTasksSkeletonsAnimated } from "@/components/course/tasks/fallback/course-tasks-card-skeletons-animated";
import useGETcoursePlans from "@/queries/courses/useGETcoursePlans";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, m, motion, useCycle } from 'framer-motion';
import { createContext, Fragment, Suspense, useContext, useEffect, useState } from "react";
import useGETcoursePlansScraped from "@/queries/extra/useGETcoursePlansScraped";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import useGETcoursePlanElements from "@/queries/extra/useGETcoursePlanElements";
import { Loader } from "@/components/ui/loader";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CalendarIcon, MoreHorizontal, MoreVertical } from "lucide-react";
import { isSupportedResourceInApp, useNavigateToResource } from "@/types/api-types/extra/learning-tool-id-types";
import { CoursePlansSkeletonsAnimated } from "@/components/course/plans/course-plans-card-skeletons-animated";
import useGETcoursePlansCurrent from "@/queries/courses/useGETcoursePlansCurrent";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { GETcoursePlansCurrent } from "@/types/api-types/courses/GETcoursePlansCurrent";
import useGETcoursePlansPast from "@/queries/courses/useGETcoursePlansPast";
import useGETcoursePlansWithoutDate from "@/queries/courses/useGETcoursePlansWithoutDate";
import useGETcoursePlansTopics from "@/queries/courses/useGETcoursePlansTopics";
import Linkify from "linkify-react";
import useGETcoursePlansCount from "@/queries/courses/useGETcoursePlansCount";

export default function CoursePlans() {
    const { id } = useParams();
    const courseId = Number(id);

    const { data, isLoading } = useGETcoursePlansCount({ courseId })

    const tabs = [
        {
            id: "current",
            label: "Current",
            value: data?.currentPlansCount,
        },
        {
            id: "past",
            label: "Past",
            value: data?.pastPlansCount,
        },
        {
            id: "without-date",
            label: "Without date",
            value: data?.withoutDatePlansCount,
        },
        {
            id: "topic",
            label: "Topic",
            value: data?.topicsCount,
        }
    ]

    const [activeTab, setTabIndex] = useCycle(...tabs)

    return (
        <div className="grid items-start gap-6 p-4 text-sm font-medium">
            <div className="flex justify-between mb-2">
                <div className="flex">
                    <CoursePlansTabButtonHoverProvider>
                        {tabs.map((tab, index) => (
                            <CoursePlansTabButton
                                key={index}
                                id={tab.id as CoursePlanTab}
                                active={activeTab.id === tab.id}
                                onClick={() => setTabIndex(tabs.indexOf(tab))}
                            >
                                {tab.label} {isLoading ? <Loader size={"xs"} className="ml-2" /> : tab.value && `(${tab.value})`}
                            </CoursePlansTabButton>
                        ))}
                    </CoursePlansTabButtonHoverProvider>
                </div>
                {/* <Button variant="outline">Table view</Button> */}
            </div>
            <div className="max-w-5xl mx-auto w-full">
                <Suspense fallback={<Loader />}>
                    <CoursePlansTabContent courseId={courseId} activeTab={activeTab.id as CoursePlanTab} />
                </Suspense>
            </div>
        </div >
    )
}

function CoursePlansTabContent({ courseId, activeTab }: { courseId: number, activeTab: CoursePlanTab }) {
    switch (activeTab) {
        case "current":
            return <CoursePlansSwitched courseId={courseId} planType={"current"} />
        case "past":
            return <CoursePlansSwitched courseId={courseId} planType={"past"} />
        case "without-date":
            return <CoursePlansSwitched courseId={courseId} planType={"withoutDate"} />
        case "topic":
            return <CoursePlansByTopic courseId={courseId} />
        default:
            return null
    }
}


function CoursePlansSwitched({ courseId, planType }: { courseId: number; planType: string }) {
    // Determine which API hook to use based on the planType
    let useGETCoursePlans;
    switch (planType) {
        case 'current':
            useGETCoursePlans = useGETcoursePlansCurrent;
            break;
        case 'past':
            useGETCoursePlans = useGETcoursePlansPast;
            break;
        case 'withoutDate':
            useGETCoursePlans = useGETcoursePlansWithoutDate;
            break;
        default:
            throw new Error('Invalid plan type');
    }

    const { data: plans, isLoading: isLoadingPlans } = useGETCoursePlans({ courseId });

    const sortedPlans = plans?.entityArray.sort((a, b) => {
        return new Date(b.start).getTime() - new Date(a.start).getTime();
    });

    return (
        <AnimatePresence mode="wait">
            {isLoadingPlans ? (
                <CoursePlansSkeletonsAnimated PageSize={10} />
            ) : (
                <m.div className="flex flex-col gap-4"
                    key={"plans"}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    layout
                >
                    {sortedPlans?.map((plan, index) => (
                        <m.div
                            key={index}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            layout
                        >
                            <CoursePlanCard plan={plan} />
                        </m.div>
                    ))}
                </m.div>
            )}
        </AnimatePresence>
    );
}

function CoursePlansByTopic({ courseId }: { courseId: number }) {
    const { data: plans, isLoading: isLoadingPlans } = useGETcoursePlansTopics({
        courseId,
    })

    return (
        <AnimatePresence mode="wait">
            {isLoadingPlans ? (
                <CoursePlansSkeletonsAnimated PageSize={10} />
            ) : (
                <m.div className="flex flex-col gap-4"
                    key={"plans"}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    layout
                >
                    {plans?.map((plan, index) => (
                        <m.div
                            key={index}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            layout
                        >
                            {/* <CoursePlanCard plan={plan} /> */}
                            {JSON.stringify(plan, null, 2)}
                        </m.div>
                    ))}
                </m.div>
            )}
        </AnimatePresence>
    )
}

function CoursePlanCard({ plan }: { plan: GETcoursePlansCurrent["entityArray"][number] }) {
    const dateFormatter = new Intl.DateTimeFormat("en-GB", {
        year: "numeric",
        month: "long",
        day: "numeric",
    })

    const timeFormatter = new Intl.DateTimeFormat("en-GB", {
        hour: "numeric",
        minute: "numeric",
    })

    const isSameDay = (date1: Date, date2: Date) => {
        return date1.toDateString() === date2.toDateString()
    }

    const formattedTimeSpan = (start: Date, stop: Date) => {
        if (isSameDay(start, stop)) {
            return `${dateFormatter.format(start)} ${timeFormatter.format(start)} - ${timeFormatter.format(stop)}`
        } else {
            return `${dateFormatter.format(start)} - ${dateFormatter.format(stop)}`
        }
    }

    const completedTopics = plan.elements.filter(topic => topic.isCompleted)

    const completedTopicsCount = completedTopics.length

    const totalTopicsCount = plan.elements.length

    const progress = (completedTopicsCount / totalTopicsCount) * 100

    const navigate = useNavigate()
    const navigateToResource = useNavigateToResource(navigate)

    return (
        <Card className={cn("p-2")}
            style={{
                backgroundColor: plan.topic ? `hsl(from ${plan.topic.color} h s l / 60%)` : "hsl(var(--foreground)/10%)",
                borderColor: plan.topic && plan.topic.borderColor
            }}
        >
            <CardContent className="p-4">
                <div className="flex justify-between">
                    <div>
                        <h3 className="text-lg font-semibold mb-2 flex items-center">
                            {plan.title}
                            {plan.topic && (
                                <Badge variant="secondary" className="ml-2 rounded-small"
                                    style={{
                                        backgroundColor: plan.topic.color,
                                        color: 'black',
                                    }}>
                                    {plan.topic.name}
                                </Badge>
                            )}
                        </h3>
                        {plan.description && (
                            <p className="text-sm mb-2">
                                <Linkify options={{
                                    render: ({ attributes, content }) => {
                                        const { href, ...props } = attributes;
                                        return <a
                                            target={"_blank"}
                                            rel={"noopener noreferrer"}
                                            className={"text-foreground hover:underline cursor-pointer"}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                window.app.openExternal(href, false)
                                            }}
                                            {...props}>
                                            {content}
                                        </a>
                                    }
                                }}
                                >
                                    {plan.description}
                                </Linkify>
                            </p>
                        )}
                    </div>
                    {/* <Button>Continue</Button> */}
                </div>
                <div className="flex items-center">
                    <CalendarIcon
                        className="w-6 h-6"
                        style={{
                            color: plan.topic ? plan.topic.color : "var(--foreground)"
                        }}
                    />
                    <span className="ml-2 text-sm">
                        {formattedTimeSpan(new Date(plan.start), new Date(plan.stop))}
                    </span>
                    <Progress
                        className="w-1/2 ml-4"
                        value={progress}
                        indicatorStyle={{
                            backgroundColor: completedTopicsCount === totalTopicsCount ? "hsl(var(--nextui-success)/80%)" : plan.topic && plan.topic.color
                        }}
                        style={{
                            backgroundColor: plan.topic ? `hsl(from ${plan.topic.color} h s l / 30%)` : "hsl(var(--foreground)/10%)",
                        }}
                    />
                    {completedTopicsCount > 0 && (
                        <span className="ml-2 text-sm">
                            {completedTopicsCount}/{totalTopicsCount} completed
                        </span>
                    )}
                </div>
                <div className="mt-4">
                    <ul
                        className="grid grid-cols-1 gap-2"
                        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 30fr))" }}
                    >
                        {plan.elements.map((element, index) => (
                            <li key={index} className="hover:cursor-pointer pr-2">
                                <span
                                    className="flex items-center gap-2"
                                >
                                    <img
                                        loading="lazy"
                                        className="inline-block w-6 h-6 mr-2 shrink-0"
                                        src={element.iconUrl} alt={element.title} />
                                    <a
                                        className="text-foreground hover:underline truncate"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={async (e) => {
                                            e.preventDefault()
                                            if (isSupportedResourceInApp({
                                                ElementId: element.id,
                                                IconUrl: element.iconUrl,
                                                Title: element.title,
                                                Url: element.url,
                                            })) {
                                                navigateToResource({
                                                    ElementId: element.id,
                                                    IconUrl: element.iconUrl,
                                                    Title: element.title,
                                                    Url: element.url,
                                                })
                                            } else {
                                                await window.app.openExternal(`https://sdu.itslearning.com${element.url}`, true)
                                            }
                                        }}
                                    >
                                        {element.title}
                                    </a>
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </CardContent>
        </Card>
    )
}

type CoursePlanTab = 'current' | 'past' | 'without-date' | 'topic' | null

type CoursePlanTabContext = [CoursePlanTab, React.Dispatch<React.SetStateAction<CoursePlanTab>>]

// CoursePlansTabButton Hover context
const CoursePlansTabButtonHoverContext = createContext<CoursePlanTabContext>(['current', () => { }])

const useCoursePlansTabButtonHover = () => useContext(CoursePlansTabButtonHoverContext)

export function CoursePlansTabButtonHoverProvider({ children }: { children: React.ReactNode }) {
    const [hoveredTab, setHoveredTab] = useState<CoursePlanTab>(null)

    return (
        <CoursePlansTabButtonHoverContext.Provider value={[hoveredTab, setHoveredTab]}>
            {children}
        </CoursePlansTabButtonHoverContext.Provider>
    )
}

export function CoursePlansTabButton({ id, active, onClick, children }: { id: CoursePlanTab, active: boolean, onClick: () => void, children: React.ReactNode }) {

    const [hoveredTab, setHoveredTab] = useCoursePlansTabButtonHover()

    return (
        <div className="relative flex items-center justify-center">
            <Button
                variant={"none"}
                onClick={onClick}
                size={"sm"}
                className={cn('capitalize h-11 relative hover:text-white transition-all duration-200 ease-in-out', active ? 'text-white' : 'text-gray-600')}
                onMouseEnter={() => setHoveredTab(id as CoursePlanTab)}
                onMouseLeave={() => setHoveredTab(null)}
            >
                {children}
                {hoveredTab === id && (
                    <motion.div
                        layoutId="active-plans-tab-indicator"
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-0 left-0 right-0 h-1 bg-purple-500 rounded-full"
                    />
                )}
                {active && !hoveredTab && (
                    <motion.div
                        layoutId="active-plans-tab-indicator"
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-0 left-0 right-0 h-1 bg-purple-500 rounded-full"
                    />
                )}
            </Button>
        </div>
    )
}