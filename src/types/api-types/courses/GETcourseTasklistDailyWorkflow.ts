import { ITSLEARNING_API_MAX_PAGESIZE, apiUrl } from "@/lib/utils.ts";
import { ItslearningRestApiEntitiesTaskDailyWorkflowSection } from "@/types/api-types/utils/Itslearning.RestApi.Entities.TaskDailyWorkflowSection.ts";

const GETcourseTasklistDailyWorkflowApiEndpoint =
  "restapi/personal/tasklistdailyworkflow/{courseId}/v1?PageIndex={PageIndex}&PageSize={PageSize}";

export const GETcourseTasklistDailyWorkflowApiUrl = (
  params: GETcourseTasklistDailyWorkflowParams,
) => {
  return apiUrl(GETcourseTasklistDailyWorkflowApiEndpoint, {
    courseId: params.courseId,
    PageIndex: params.PageIndex,
    PageSize: params.PageSize,
  });
};

export type GETcourseTasklistDailyWorkflow = {
  EntityArray: ItslearningRestApiEntitiesTaskDailyWorkflowSection[];
  Total: number;
  CurrentPageIndex: number;
  PageSize: number;
};

export type GETcourseTasklistDailyWorkflowParams = {
  courseId: number;
  PageIndex?: number;
  PageSize?: ITSLEARNING_API_MAX_PAGESIZE;
};
