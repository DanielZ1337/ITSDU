import { ITSLEARNING_API_MAX_PAGESIZE, apiUrl } from "@/lib/utils.ts";
import { ItslearningPlatformRestApiSdkCommonEntitiesLearningToolType } from "@/types/api-types/utils/Itslearning.Platform.RestApi.Sdk.Common.Entities.LearningToolType.ts";
import { ItslearningPlatformRestApiSdkLearningToolAppEntitiesElementPermission } from "@/types/api-types/utils/Itslearning.Platform.RestApi.Sdk.LearningToolApp.Entities.ElementPermission.ts";
import { ItslearningRestApiEntitiesPersonalCourseCourseResource } from "@/types/api-types/utils/Itslearning.RestApi.Entities.Personal.Course.CourseResource.ts";
import { ItsolutionsItslUtilsConstantsElementType } from "@/types/api-types/utils/Itsolutions.ItslUtils.Constants.ElementType.ts";

const POSTcourseAllResourcesApiEndpoint =
	"restapi/personal/courses/{courseId}/resources/extended/v1?PageIndex={PageIndex}&PageSize={PageSize}";

export const POSTcourseAllResourcesApiUrl = (
	params: POSTcourseAllResourcesParams,
) => {
	return apiUrl(POSTcourseAllResourcesApiEndpoint, {
		courseId: params.courseId,
		PageIndex: params.PageIndex,
		PageSize: params.PageSize,
	});
};

export type POSTcourseAllResources = {
	EntityArray: ItslearningRestApiEntitiesPersonalCourseCourseResource[];
	Total: number;
	CurrentPageIndex: number;
	PageSize: number;
};

export type POSTcourseAllResourcesParams = {
	courseId: number;
	PageIndex?: number;
	PageSize?: ITSLEARNING_API_MAX_PAGESIZE;
};

export type POSTcourseAllResourcesBody = {
	ElementType: ItsolutionsItslUtilsConstantsElementType;
	LearningToolIds: number[];
	LearningToolType: ItslearningPlatformRestApiSdkCommonEntitiesLearningToolType;
	ElementPermissions: ItslearningPlatformRestApiSdkLearningToolAppEntitiesElementPermission;
	ElementIds: number[];
	IncludeDeleted: boolean;
	IncludeExtraWorkElements: boolean;
};
