import useGETcalendarEvents from "@/queries/calendar/useGETcalendarEvents.ts";
import {Suspense} from "react";

export default function Querytesting() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CalendarEvents/>
        </Suspense>
    )
}

function CalendarEvents() {
    const {data} = useGETcalendarEvents({
        fromDate: "2021-09-01",
        pageSize: 10,
        page: 0,
    }, {
        suspense: true,
    })

    return (
        <div>
            {data!.EntityArray.map((item) => (
                <div key={item.EventId}>
                    {item.EventId}
                </div>
            ))}
        </div>
    )
}