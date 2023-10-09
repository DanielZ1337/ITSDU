import {
    ItslearningRestApiEntitiesElementLink
} from "@/types/api-types/utils/Itslearning.RestApi.Entities.ElementLink.ts";
import {
    ItslearningRestApiEntitiesPersonalCalendarPlanLink
} from "@/types/api-types/utils/Itslearning.RestApi.Entities.Personal.Calendar.PlanLink.ts";
import {
    ItslearningRestApiEntitiesPersonalCalendarCalendarEventType
} from "@/types/api-types/utils/Itslearning.RestApi.Entities.Personal.Calendar.CalendarEventType.ts";
import {apiUrl} from "@/lib/utils.ts";

const GETcalenderEventApiEndpoint = "restapi/personal/calendar/events/{eventId}/v1"

export const GETcalenderEventApiUrl = (params: GETcalenderEventParams) => {
    return apiUrl(GETcalenderEventApiEndpoint, {
        eventId: params.eventId
    })
}

export type GETcalenderEvent = {
    EventUrl: string
    HasMoreContent: boolean
    Bookings: {
        Name: string
    }[]
    ElementLinks: ItslearningRestApiEntitiesElementLink[]
    PlanLinks: ItslearningRestApiEntitiesPersonalCalendarPlanLink[]
    EventId: number
    FromDate: string
    ToDate: string
    EventTitle: string
    Description: string
    ImportDescription: string
    EventType: ItslearningRestApiEntitiesPersonalCalendarCalendarEventType
    LocationId: number
    LocationGroupId: number
    LocationColor: string
    LocationFillColor: string
    LocationTitle: string
    LocationFriendlyName: string
    HidePersonalWordForPersonalEvent: boolean
    AttendanceDetails: {
        KeepAttendancePageUrl: string
        AttendanceStatistics: {
            Present: number
            Absent: number
            Excluded: number
        }
    }
}

export type GETcalenderEventParams = {
    eventId: number
}
