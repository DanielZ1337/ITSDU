import { ITSLEARNING_API_MAX_PAGESIZE, apiUrl } from "@/lib/utils.ts";
import { ItslearningRestApiEntitiesPersonalCalendarEvent } from "@/types/api-types/utils/Itslearning.RestApi.Entities.Personal.CalendarEvent.ts";

const GETcourseCalenderEventsApiEndpoint =
  "restapi/personal/courses/{courseId}/calendarevents/v1?PageIndex={PageIndex}&PageSize={PageSize}&fromDate={fromDate}&toDate={toDate}";

export const GETcourseCalenderEventsApiUrl = (params: GETcourseCalenderEventsParams) => {
  return apiUrl(GETcourseCalenderEventsApiEndpoint, {
    courseId: params.courseId,
    PageIndex: params.PageIndex,
    PageSize: params.PageSize,
    fromDate: params.fromDate,
    toDate: params.toDate,
  });
};

export type GETcourseCalenderEvents = {
  EntityArray: ItslearningRestApiEntitiesPersonalCalendarEvent[];
  Total: number;
  CurrentPageIndex: number;
  PageSize: number;
};

export type GETcourseCalenderEventsParams = {
  courseId: number;
  PageIndex?: number;
  PageSize?: ITSLEARNING_API_MAX_PAGESIZE;
  fromDate?: Date;
  toDate?: Date;
};
