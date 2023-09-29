import {ItslearningRestApiEntitiesFollowUpTask} from "@/api-types/utils/Itslearning.RestApi.Entities.FollowUpTask.ts";
import {apiUrl} from "@/lib/utils.ts";

const GETcourseFollowUpTasksApiEndpoint = "restapi/personal/courses/{courseId}/followuptasks/v1?PageIndex={PageIndex}&PageSize={PageSize}"

export const GETcourseFollowUpTasksApiUrl = (params: GETcourseFollowUpTasksParams) => {
    return apiUrl(GETcourseFollowUpTasksApiEndpoint, {
        courseId: params.courseId,
        PageIndex: params.PageIndex,
        PageSize: params.PageSize
    })
}

export type GETcourseFollowUpTasks = {
    EntityArray: ItslearningRestApiEntitiesFollowUpTask[]
    Total: number
    CurrentPageIndex: number
    PageSize: number
}

export type GETcourseFollowUpTasksParams = {
    courseId: number
    PageIndex?: number
    PageSize?: number
}