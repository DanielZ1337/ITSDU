import { ItslearningRestApiEntitiesPersonalCalendarAttendanceAttendanceDetails } from "@/types/api-types/utils/Itslearning.RestApi.Entities.Personal.Calendar.Attendance.AttendanceDetails.ts";

export type ItslearningRestApiEntitiesPersonalCalendarEvent = {
	id: number;
	FromDate: Date;
	ToDate: Date;
	EventTitle: string;
	Description: string;
	ImportDescription: string;
	CourseId: number;
	CourseGroupId: number;
	LocationColor: string;
	LocationFillColor: string;
	LocationTitle: string;
	LocationFriendlyName: string;
	AttendanceDetails: ItslearningRestApiEntitiesPersonalCalendarAttendanceAttendanceDetails[];
};
