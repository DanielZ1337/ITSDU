import {Calendar as ReactBigCalendar, momentLocalizer} from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '@/styles/calendar.css';
import useGETcalendarEvents from '@/queries/calendar/useGETcalendarEvents';
import {cn} from "@/lib/utils.ts";
import {Spinner} from "@nextui-org/spinner";
import {
    ItslearningRestApiEntitiesPersonalCalendarCalendarEventV2
} from "@/types/api-types/utils/Itslearning.RestApi.Entities.Personal.Calendar.CalendarEventV2.ts";
import {convert} from "html-to-text";
import he from "he";

const localizer = momentLocalizer(moment);

export default function Calendar() {

    const {data, isLoading} = useGETcalendarEvents({
        fromDate: new Date(2021, 1),
    }, {
        keepPreviousData: true,
    })

    const events = data?.EntityArray.map((event) => {
        return {
            ...event,
            FromDate: new Date(event.FromDate),
            ToDate: new Date(event.ToDate),
        }
    })

    return (
        <div className={"flex flex-1 flex-col h-full"}>
            {/*<div className={"flex flex-row gap-4 w-full justify-end mt-4 sm:mt-8 md:mt-12 lg:mt-16 xl:mt-20 h-[3vh"}>*/}
            {/*    <div className={"w-1/3 relative"}>*/}
            {/*        <Input*/}
            <div className={"relative flex flex-1 flex-col h-full"}>
                {isLoading && (
                    <div className={"absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 "}>
                        <Spinner size={"lg"}/>
                    </div>
                )}

                <ReactBigCalendar
                    localizer={localizer}
                    events={events}
                    startAccessor="FromDate"
                    endAccessor="ToDate"
                    titleAccessor="EventTitle"
                    style={{height: '100%'}}
                    views={{
                        month: true,
                        day: true,
                        week: true,
                        agenda: CustomAgendaView,
                    }}
                    className={cn("flex flex-1 flex-col h-full", isLoading && "opacity-10")}
                    min={new Date("2023-10-23T06:00:00.000Z")}
                    max={new Date("2023-10-23T16:00:00.000Z")}
                    components={{
                        eventWrapper: EventCard,
                        toolbar: CustomToolBar,
                    }}
                />
            </div>
        </div>
    );
}

function CustomToolBar({...props}) {
    
    //{date, view, views, label, onView, onNavigate, localizer}
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

function EventCard({event}: { event: ItslearningRestApiEntitiesPersonalCalendarCalendarEventV2 }) {
    return (
        <div className={"flex flex-col p-2 bg-purple-500 rounded border-2 border-purple-800"}>
           <span className={"text-white font-semibold text-sm"}>
                {convert(he.decode(event.EventTitle))}
           </span>
        </div>
    )
}

function CustomAgendaView({...props}) {
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