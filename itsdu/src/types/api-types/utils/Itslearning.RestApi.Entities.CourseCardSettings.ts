import { ItslearningRestApiEntitiesCourseCardTeacher } from "@/types/api-types/utils/Itslearning.RestApi.Entities.CourseCardTeacher.ts";

export type ItslearningRestApiEntitiesCourseCardSettings = {
	CourseTitle: string;
	FriendlyName: string;
	CourseColorClass: string;
	VisibleCourseCardCandidateIds: string;
	VisibleCourseCardCandidates: ItslearningRestApiEntitiesCourseCardTeacher[];
	CanEditCourseColour: boolean;
	CanEditFriendlyName: boolean;
};
