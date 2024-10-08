import { apiUrl } from "@/lib/utils.ts";
import { EntityListOfItslearningRestApiEntitiesPersonalCourseCourseResource } from "@/types/api-types/utils/EntityListOfItslearning.RestApi.Entities.Personal.Course.CourseResource.ts";
import { ItsolutionsItslUtilsConstantsLocationType } from "@/types/api-types/utils/Itsolutions.ItslUtils.Constants.LocationType.ts";

const GETcourseResourcesBySearchApiEndpoint =
	"restapi/personal/courses/{locationId}/resources/search/v1?locationType={locationType}&searchText={searchText}";

export const GETcourseResourcesBySearchApiUrl = (
	params: GETcourseResourcesBySearchParams,
) => {
	return apiUrl(GETcourseResourcesBySearchApiEndpoint, {
		locationId: params.locationId,
		locationType: params.locationType,
		searchText: params.searchText,
	});
};

export type GETcourseResourcesBySearch = {
	Resources: EntityListOfItslearningRestApiEntitiesPersonalCourseCourseResource;
	AddElementUrl: string;
};

export type GETcourseResourcesBySearchParams = {
	locationId: number;
	locationType: ItsolutionsItslUtilsConstantsLocationType;
	searchText: string;
};
