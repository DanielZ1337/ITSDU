import {Calendar as ReactBigCalendar, momentLocalizer} from 'react-big-calendar'
import moment from 'moment'
import '@/styles/calendar.css'

const localizer = momentLocalizer(moment)
export default function Calendar() {
    return (
        <div className="myCustomHeight">
            <ReactBigCalendar
                localizer={localizer}
                // events={myEventsList}
                startAccessor="start"
                endAccessor="end"
            />
        </div>
    )
}