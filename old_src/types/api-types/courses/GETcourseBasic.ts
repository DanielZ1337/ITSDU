import {ItslearningRestApiEntitiesCourse} from "@/types/api-types/utils/Itslearning.RestApi.Entities.Course.ts";
import {apiUrl} from "@/lib/utils.ts";

const GETcourseBasicApiEndpoint = 'restapi/personal/courses/{courseId}/v1'

export const GETcourseBasicApiUrl = (params: GETcourseBasicParams) => {
    return apiUrl(GETcourseBasicApiEndpoint, {
        courseId: params.courseId
    })
}

export type GETcourseBasic = ItslearningRestApiEntitiesCourse

export type GETcourseBasicParams = {
    courseId: number
}