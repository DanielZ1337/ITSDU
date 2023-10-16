import {apiUrl} from "@/lib/utils.ts";
import {
    ItslearningRestApiEntitiesTaskDailyWorkflowSection
} from "@/types/api-types/utils/Itslearning.RestApi.Entities.TaskDailyWorkflowSection.ts";

const GETtasklistDailyWorkflowApiEndpoint = "restapi/personal/tasklistdailyworkflow/v1?PageIndex={PageIndex}&PageSize={PageSize}"

export const GETtasklistDailyWorkflowApiUrl = (params: GETtasklistDailyWorkflowParams) => {
    return apiUrl(GETtasklistDailyWorkflowApiEndpoint, {
        PageIndex: params.PageIndex,
        PageSize: params.PageSize
    })
}

export type GETtasklistDailyWorkflow = {
    EntityArray: ItslearningRestApiEntitiesTaskDailyWorkflowSection[]
    Total: number
    CurrentPageIndex: number
    PageSize: number
}

export type GETtasklistDailyWorkflowParams = {
    PageIndex?: number
    PageSize?: number
}