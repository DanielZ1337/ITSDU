import {
    ItslearningRestApiEntitiesPersonalCourseCourseParticipant
} from "@/api-types/utils/Itslearning.RestApi.Entities.Personal.Course.CourseParticipant.ts";
import {apiUrl} from "@/lib/utils.ts";

const GETcourseParticipantsApiEndpoint = "restapi/personal/courses/{courseId}/participants/v3?PageIndex={PageIndex}&PageSize={PageSize}&courseProfileIds={courseProfileIds}&groupIds={groupIds}&searchText={searchText}&orderByField={orderByField}&orderAscending={orderAscending}"

export const GETcourseParticipantsApiUrl = (params: GETcourseParticipantsParams) => {
    return apiUrl(GETcourseParticipantsApiEndpoint, {
        courseId: params.courseId,
        PageIndex: params.PageIndex,
        PageSize: params.PageSize,
        courseProfileIds: params.courseProfileIds,
        groupIds: params.groupIds,
        searchText: params.searchText,
        orderByField: params.orderByField,
        orderAscending: params.orderAscending
    })
}

export type GETcourseParticipants = {
    EntityArray: ItslearningRestApiEntitiesPersonalCourseCourseParticipant[]
    Total: number
    CurrentPageIndex: number
    PageSize: number
}

export type GETcourseParticipantsParams = {
    courseId: number
    PageIndex?: number
    PageSize?: number
    courseProfileIds: number[]
    groupIds: number[]
    searchText?: string
    orderByField?: string
    orderAscending?: boolean
}