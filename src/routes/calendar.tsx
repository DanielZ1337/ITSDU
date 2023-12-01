import { Calendar as ReactBigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '@/styles/calendar.css';
import useGETcalendarEvents from '@/queries/calendar/useGETcalendarEvents';
import { cn } from "@/lib/utils.ts";
import { Spinner } from "@nextui-org/spinner";
import {
    ItslearningRestApiEntitiesPersonalCalendarCalendarEventV2
} from "@/types/api-types/utils/Itslearning.RestApi.Entities.Personal.Calendar.CalendarEventV2.ts";
import { convert } from "html-to-text";
import he from "he";
import { Button } from "@/components/ui/button.tsx";
import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
    ItslearningRestApiEntitiesPersonalCalendarEvent
} from '@/types/api-types/utils/Itslearning.RestApi.Entities.Personal.CalendarEvent';

const localizer = momentLocalizer(moment);

export default function CalendarIndex() {

    const { data, isLoading } = useGETcalendarEvents({
        fromDate: new Date(2021, 1),
    }, {
        keepPreviousData: true,
    })

    const events = data?.EntityArray.map((event) => {
        console.log(new Date(event.FromDate))

        return {
            ...event,
            FromDate: new Date(event.FromDate),
            ToDate: new Date(event.ToDate),
        }
    })

    const [event, setEvent] = useState(null)
    return (
        <div className={"flex flex-1 flex-col h-full p-4"}>
            {/*<div className={"flex flex-row gap-4 w-full justify-end mt-4 sm:mt-8 md:mt-12 lg:mt-16 xl:mt-20 h-[3vh"}>*/}
            {/*    <div className={"w-1/3 relative"}>*/}
            {/*        <Input*/}
            <Calendar events={events} isLoading={isLoading} />
        </div>
    );
}

type CalendarEvent =
    ItslearningRestApiEntitiesPersonalCalendarCalendarEventV2
    | ItslearningRestApiEntitiesPersonalCalendarEvent & {
        EventId: number
        EventType: number
        LocationId: number
        LocationGroupId: number
        HidePersonalWordForPersonalEvent: boolean
    }

type ViewsType = "month" | "week" | "day" | "agenda"

export function Calendar({ events, isLoading, views, defaultView, showToolbar, showHeader, className }: {
    events?: CalendarEvent[] | ItslearningRestApiEntitiesPersonalCalendarEvent[],
    isLoading?: boolean,
    views?: ViewsType[],
    defaultView?: ViewsType,
    showToolbar?: boolean,
    showHeader?: boolean,
    className?: string
}) {
    const [view, setView] = useState<ViewsType>(defaultView || "month")

    useEffect(() => {
        if (!showHeader && showHeader !== undefined) {
            // remove div with class rbc-time-header
            const timeHeader = document.getElementsByClassName("rbc-time-header")[0]
            if (timeHeader) timeHeader.remove()
        }
    }, [])


    console.log(events)
    return (
        <div className={cn("relative flex flex-1 flex-col h-full", className)}>
            {isLoading && (
                <div className={"absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 "}>
                    <Spinner size={"lg"} />
                </div>
            )}
            <ReactBigCalendar
                toolbar={showToolbar}
                localizer={localizer}
                events={events}
                startAccessor="FromDate"
                endAccessor="ToDate"
                titleAccessor={"EventTitle"}
                style={{ height: "100%" }}
                onView={(view) => setView(view as any)}
                min={new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 8)}
                max={new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 18)}
                views={views || ["month", "week", "day", "agenda"]}
                view={view}
                components={{
                    header: (props) => {

                        const date = props.date
                        const isCurrentDate = moment(date).isSame(new Date(), "day")

                        // 22 Sun format
                        // 23 Mon format
                        const dayOfWeek = moment(date).format("ddd")
                        const dayOfMonth = moment(date).format("D")
                        return (
                            <div
                                className={cn("flex items-center justify-center gap-2 h-full px-2 py-1.5")}
                            >
                                <span className={"text-gray-500 text-medium font-semibold"}>
                                    {dayOfWeek}
                                </span>
                                {view === "week" && (
                                    <div className={cn("w-7 h-7 flex items-center justify-center", isCurrentDate && "bg-primary text-primary-foreground rounded-full")}>
                                        <span
                                            className={cn("text-center text-sm font-semibold")}>
                                            {dayOfMonth}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )
                    },
                    eventWrapper: (props: any) => {

                        const label = props.label
                        const event = props.event

                        const [screenHeight, setScreenHeight] = useState(window.innerHeight)

                        useEffect(() => {
                            const onResize = () => {
                                setScreenHeight(window.innerHeight)
                            }

                            onResize()

                            window.addEventListener("resize", onResize)

                            return () => {
                                window.removeEventListener("resize", onResize)
                            }
                        }, [])

                        return (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <div
                                        {...props}
                                        {...props.children.props}
                                        className={cn(props.children.props.className, "active:!opacity-50 active:scale-95 transition-all !duration-75 ease-in-out cursor-pointer")}
                                        style={props.children.props.style}
                                    >
                                        <span
                                            className={"inline-flex flex-col gap-2 text-white font-semibold text-sm"}>
                                            {label && (
                                                <span>
                                                    {label}
                                                </span>
                                            )}
                                            <div className={"flex flex-col gap-2"}>
                                                <span className={cn("text-white font-semibold text-sm")}>
                                                    {convert(he.decode(event.LocationTitle))}
                                                </span>
                                                <span
                                                    className={cn("text-white font-semibold text-sm", screenHeight < 700 && "hidden")}>
                                                    {convert(he.decode(event.EventTitle))}
                                                </span>
                                            </div>
                                        </span>
                                    </div>
                                </PopoverTrigger>
                                <PopoverContent className="overflow-hidden break-all max-w-[30vw]">
                                    <div className={"flex flex-col gap-2 p-2"}>
                                        <span className={"text-white font-semibold text-sm"}>
                                            {convert(he.decode(event.EventTitle))}
                                        </span>
                                        <span className={"text-white font-semibold text-sm"}>
                                            {convert(he.decode(event.ImportDescription.replace(/\\n/g, ", ")))}
                                        </span>
                                        <span className={"text-white font-semibold text-sm"}>
                                            {convert(he.decode(event.LocationTitle))}
                                        </span>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )
                    },
                    toolbar: CustomToolBar,
                }}
            />
        </div>
    )
}

function CustomToolBar({ ...props }) {

    //{date, view, views, label, onView, onNavigate, localizer}

    const weekNumber = moment(props.date).week()
    return (
        <div className={"flex flex-col pb-2"}>
            <div className={"flex flex-row justify-between items-center"}>
                <span className={"text-xl font-semibold"}>
                    {props.label} (Week {weekNumber})
                </span>
                <div className={"flex flex-row gap-2"}>
                    <Button onClick={() => props.onNavigate("PREV")}>Prev</Button>
                    <Button onClick={() => props.onNavigate("NEXT")}>Next</Button>
                    <Button onClick={() => props.onView("month")}>Month</Button>
                    <Button onClick={() => props.onView("week")}>Week</Button>
                    <Button onClick={() => props.onView("day")}>Day</Button>
                    <Button onClick={() => props.onView("agenda")}>Agenda</Button>
                    <Button onClick={() => props.onNavigate("TODAY")}>Today</Button>
                </div>
            </div>
        </div>
    )
}

function EventCard({ event }: { event: ItslearningRestApiEntitiesPersonalCalendarCalendarEventV2 }) {
    return (
        <div className={"flex flex-col p-2 bg-purple-500 rounded border-2 border-purple-800"}>
            <span className={"text-white font-semibold text-sm"}>
                {convert(he.decode(event.EventTitle))}
            </span>
        </div>
    )
}

function CustomAgendaView({ ...props }) {
    console.log(props)

    return (
        <div className={"flex flex-col"}>
            <div className={"flex flex-row justify-between items-center"}>
                <span className={"text-xl font-semibold"}>
                    {props.label}
                </span>
            </div>
        </div>
    )
}