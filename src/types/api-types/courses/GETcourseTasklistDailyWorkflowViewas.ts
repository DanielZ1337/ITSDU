import { ITSLEARNING_API_MAX_PAGESIZE, apiUrl } from "@/lib/utils.ts";
import { ItslearningRestApiEntitiesTaskDailyWorkflowSection } from "@/types/api-types/utils/Itslearning.RestApi.Entities.TaskDailyWorkflowSection.ts";

const GETcourseTasklistDailyWorkflowApiViewasEndpoint =
  "restapi/personal/tasklistdailyworkflow/{courseId}/viewas/v1?PageIndex={PageIndex}&PageSize={PageSize}";

export const GETcourseTasklistDailyWorkflowApiViewasUrl = (
  params: GETcourseTasklistDailyWorkflowParams,
) => {
  return apiUrl(GETcourseTasklistDailyWorkflowApiViewasEndpoint, {
    courseId: params.courseId,
    PageIndex: params.PageIndex,
    PageSize: params.PageSize,
  });
};

export type GETcourseTasklistDailyWorkflowViewas = {
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
