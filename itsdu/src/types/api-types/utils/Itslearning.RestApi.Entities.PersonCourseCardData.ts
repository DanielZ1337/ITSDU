import { ItslearningRestApiEntitiesPersonSimple } from "@/types/api-types/utils/Itslearning.RestApi.Entities.PersonSimple.ts";

export type ItslearningRestApiEntitiesPersonCourseCardData = {
	FollowUpTaskCount: number;
	TaskCount: number;
	TeachersInCourse: ItslearningRestApiEntitiesPersonSimple[];
	LastUpdatedUtc: Date;
	NewNotificationsCount: number;
	NewBulletinsCount: number;
	Url: string;
	HasAdminPermissions: boolean;
	HasStudentPermissions: boolean;
	CourseId: number;
	Title: string;
	FriendlyName: string;
	CourseColor: string;
	CourseFillColor: string;
	CourseCode: string;
};
