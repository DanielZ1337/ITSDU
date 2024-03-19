import { apiUrl, ITSLEARNING_API_MAX_SIZE } from "@/lib/utils.ts";
import { ItslearningRestApiEntitiesTaskDailyWorkflow } from "../utils/Itslearning.RestApi.Entities.TaskDailyWorkflow";

const GETcourseTasklistDailyWorkflowCompletedApiEndpoint = "restapi/personal/tasklistdailyworkflow/{courseId}/completed/v1?PageIndex={PageIndex}&PageSize={PageSize}"

export const GETcourseTasklistDailyWorkflowCompletedApiUrl = (params: GETcourseTasklistDailyWorkflowCompletedParams) => {
    return apiUrl(GETcourseTasklistDailyWorkflowCompletedApiEndpoint, {
        courseId: params.courseId,
        PageIndex: params.PageIndex,
        PageSize: params.PageSize
    })
}

export type GETcourseTasklistDailyWorkflowCompleted = {
    EntityArray: ItslearningRestApiEntitiesTaskDailyWorkflow[]
    Total: number
    CurrentPageIndex: number
    PageSize: number
}

export type GETcourseTasklistDailyWorkflowCompletedParams = {
    courseId: number
    PageIndex?: number
    PageSize?: ITSLEARNING_API_MAX_SIZE
}