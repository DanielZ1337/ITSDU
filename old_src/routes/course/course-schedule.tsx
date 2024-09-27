import useGETcourseCalendarEvents from "@/queries/courses/useGETcourseCalendarEvents"
import {useParams} from "react-router-dom"
import {Calendar} from "../calendar"
import useGETcourseBasic from "@/queries/courses/useGETcourseBasic"

export default function CourseSchedule() {
    const {id} = useParams()
    const courseId = Number(id)

    const {data: courseInfo} = useGETcourseBasic({
        courseId
    }, {
        suspense: true
    })

    const {data, isLoading} = useGETcourseCalendarEvents({
        courseId,
        fromDate: new Date(courseInfo!.CreatedDateTimeUtc)
    })


    const events = data?.EntityArray.map((event) => {

        return {
            ...event,
            FromDate: new Date(event.FromDate),
            ToDate: new Date(event.ToDate),
            EventId: event.id,
            EventType: 456,
            LocationId: courseId,
            LocationGroupId: 0,
            HidePersonalWordForPersonalEvent: false
        }
    })

    return (
        <div className={"flex flex-1 flex-col h-full p-4"}>
            <Calendar events={events} isLoading={isLoading}/>
        </div>
    )
}
