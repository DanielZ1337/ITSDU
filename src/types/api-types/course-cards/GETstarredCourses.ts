import { ITSLEARNING_API_MAX_PAGESIZE, apiUrl } from "@/lib/utils.ts";
import { CourseCardsSortByTypes } from "@/types/api-types/extra/course-cards-sort-by-types.ts";
import { ItslearningRestApiEntitiesCourseCard } from "@/types/api-types/utils/Itslearning.RestApi.Entities.CourseCard.ts";

const GETstarredCoursesApiEndpoint =
	"restapi/personal/courses/cards/starred/v1?PageIndex={PageIndex}&PageSize={PageSize}&sortBy={sortBy}&searchText={searchText}&isShowMore={isShowMore}";

export const GETstarredCoursesApiUrl = (params: GETstarredCoursesParams) => {
	return apiUrl(GETstarredCoursesApiEndpoint, {
		PageIndex: params.PageIndex,
		PageSize: params.PageSize,
		sortBy: params.sortBy,
		searchText: params.searchText,
		isShowMore: params.isShowMore,
	});
};

export type GETstarredCourses = {
	EntityArray: ItslearningRestApiEntitiesCourseCard[];
	Total: number;
	CurrentPageIndex: number;
	PageSize: number;
};

export type GETstarredCoursesParams = {
	PageIndex?: number;
	PageSize?: ITSLEARNING_API_MAX_PAGESIZE;
	sortBy?: CourseCardsSortByTypes;
	searchText?: string;
	isShowMore?: boolean;
};
