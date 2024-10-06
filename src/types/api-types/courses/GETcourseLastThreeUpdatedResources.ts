import { apiUrl } from "@/lib/utils.ts";
import { EntityListOfItslearningRestApiEntitiesPersonalCourseCourseResource } from "@/types/api-types/utils/EntityListOfItslearning.RestApi.Entities.Personal.Course.CourseResource.ts";

const GETcourseLastThreeUpdatedResourcesApiEndpoint =
  "restapi/personal/courses/{courseId}/resources/lastupdated/v1?elementType={elementType}&numberOfElements={numberOfElements}&excludeLearningPathSubElements={excludeLearningPathSubElements}";

export const GETcourseLastThreeUpdatedResourcesApiUrl = (
  params: GETcourseLastThreeUpdatedResourcesParams,
) => {
  return apiUrl(GETcourseLastThreeUpdatedResourcesApiEndpoint, {
    courseId: params.courseId,
  });
};

export type GETcourseLastThreeUpdatedResources =
  EntityListOfItslearningRestApiEntitiesPersonalCourseCourseResource;

export type GETcourseLastThreeUpdatedResourcesParams = {
  courseId: number;
  elementType: number;
  numberOfElements?: number;
  excludeLearningPathSubElements?: boolean;
};
