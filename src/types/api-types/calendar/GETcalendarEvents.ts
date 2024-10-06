import { ITSLEARNING_API_MAX_PAGESIZE, apiUrl } from "@/lib/utils.ts";
import { ItslearningRestApiEntitiesPersonalCalendarCalendarEventV2 } from "@/types/api-types/utils/Itslearning.RestApi.Entities.Personal.Calendar.CalendarEventV2.ts";

const GETcalenderEventsApiEndpoint =
  "restapi/personal/calendar/events/v1?fromDate={fromDate}&PageIndex={PageIndex}&PageSize={PageSize}";

export function GETcalenderEventsApiUrl(params: GETcalendarEventsParams) {
  return apiUrl(GETcalenderEventsApiEndpoint, {
    PageIndex: params.page,
    PageSize: params.pageSize,
    fromDate: params.fromDate,
  });
}

export type GETcalendarEvents = {
  EntityArray: ItslearningRestApiEntitiesPersonalCalendarCalendarEventV2[];
  Total: number;
  CurrentPageIndex: number;
  PageSize: number;
};

export type GETcalendarEventsParams = {
  fromDate?: Date | string;
  page?: number;
  pageSize?: ITSLEARNING_API_MAX_PAGESIZE;
};
