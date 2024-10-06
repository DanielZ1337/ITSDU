import { ITSLEARNING_API_MAX_PAGESIZE, apiUrl } from "@/lib/utils.ts";
import { EntityListOfItslearningRestApiEntitiesPersonalCourseCourseResource } from "@/types/api-types/utils/EntityListOfItslearning.RestApi.Entities.Personal.Course.CourseResource.ts";
import { ItslearningPlatformRestApiSdkCommonEntitiesLearningToolType } from "@/types/api-types/utils/Itslearning.Platform.RestApi.Sdk.Common.Entities.LearningToolType.ts";
import { ItsolutionsItslUtilsConstantsElementType } from "@/types/api-types/utils/Itsolutions.ItslUtils.Constants.ElementType.ts";

const GETcourseFolderResourcesApiEndpoint =
  "restapi/personal/courses/{courseId}/folders/{folderId}/resources/v1?PageIndex={PageIndex}&PageSize={PageSize}&elementType={elementType}&learningToolType={learningToolType}";

export const GETcourseFolderResourcesApiUrl = (
  params: GETcourseFolderResourcesParams,
) => {
  return apiUrl(GETcourseFolderResourcesApiEndpoint, {
    courseId: params.courseId,
    folderId: params.folderId,
    PageIndex: params.PageIndex,
    PageSize: params.PageSize,
    elementType: params.elementType,
    learningToolType: params.learningToolType,
  });
};

export type GETcourseFolderResources = {
  Resources: EntityListOfItslearningRestApiEntitiesPersonalCourseCourseResource;
  AddElementUrl: string;
};

export type GETcourseFolderResourcesParams = {
  courseId: number;
  folderId: number;
  PageIndex?: number;
  PageSize?: ITSLEARNING_API_MAX_PAGESIZE;
  elementType?: ItsolutionsItslUtilsConstantsElementType;
  learningToolType?: ItslearningPlatformRestApiSdkCommonEntitiesLearningToolType;
};
