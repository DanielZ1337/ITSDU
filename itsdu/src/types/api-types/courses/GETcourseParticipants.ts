import { ItslearningRestApiEntitiesPersonalCourseCourseParticipant } from "@/types/api-types/utils/Itslearning.RestApi.Entities.Personal.Course.CourseParticipant.ts";
import { apiUrl, ITSLEARNING_API_MAX_PAGESIZE } from "@/lib/utils.ts";

const GETcourseParticipantsApiEndpoint =
	"restapi/personal/courses/{courseId}/participants/v3?PageIndex={PageIndex}&PageSize={PageSize}&courseProfileIds={courseProfileIds}&groupIds={groupIds}&searchText={searchText}&orderByField={orderByField}&orderAscending={orderAscending}";

export const GETcourseParticipantsApiUrl = (
	params: GETcourseParticipantsParams,
) => {
	return apiUrl(GETcourseParticipantsApiEndpoint, {
		courseId: params.courseId,
		PageIndex: params.PageIndex,
		PageSize: params.PageSize,
		courseProfileIds: params.courseProfileIds,
		groupIds: params.groupIds,
		searchText: params.searchText,
		orderByField: params.orderByField,
		orderAscending: params.orderAscending,
	});
};

export type GETcourseParticipants = {
	EntityArray: ItslearningRestApiEntitiesPersonalCourseCourseParticipant[];
	Total: number;
	CurrentPageIndex: number;
	PageSize: number;
};

export type GETcourseParticipantsParams = {
	courseId: number;
	PageIndex?: number;
	PageSize?: ITSLEARNING_API_MAX_PAGESIZE;
	courseProfileIds?: number[];
	groupIds?: number[];
	hierarchyIds?: number[];
	searchText?: string;
	orderByField?: string;
	orderAscending?: boolean;
};
