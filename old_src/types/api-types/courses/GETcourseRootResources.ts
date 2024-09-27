import {apiUrl, ITSLEARNING_API_MAX_PAGESIZE} from "@/lib/utils.ts";
import {
    EntityListOfItslearningRestApiEntitiesPersonalCourseCourseResource
} from "@/types/api-types/utils/EntityListOfItslearning.RestApi.Entities.Personal.Course.CourseResource.ts";
import {
    ItsolutionsItslUtilsConstantsElementType
} from "@/types/api-types/utils/Itsolutions.ItslUtils.Constants.ElementType.ts";
import {
    ItslearningPlatformRestApiSdkCommonEntitiesLearningToolType
} from "@/types/api-types/utils/Itslearning.Platform.RestApi.Sdk.Common.Entities.LearningToolType.ts";

const GETcourseRootResourcesApiEndpoint = "restapi/personal/courses/{courseId}/resources/v1?PageIndex={PageIndex}&PageSize={PageSize}&elementType={elementType}&learningToolType={learningToolType}"

export const GETcourseRootResourcesApiUrl = (params: GETcourseRootResourcesParams) => {
    return apiUrl(GETcourseRootResourcesApiEndpoint, {
        courseId: params.courseId,
        PageIndex: params.PageIndex,
        PageSize: params.PageSize,
        elementType: params.elementType,
        learningToolType: params.learningToolType
    })
}

export type GETcourseRootResources = {
    Resources: EntityListOfItslearningRestApiEntitiesPersonalCourseCourseResource
    AddElementUrl: string
}

export type GETcourseRootResourcesParams = {
    courseId: number
    PageIndex?: number
    PageSize?: ITSLEARNING_API_MAX_PAGESIZE
    elementType?: ItsolutionsItslUtilsConstantsElementType
    learningToolType?: ItslearningPlatformRestApiSdkCommonEntitiesLearningToolType
}