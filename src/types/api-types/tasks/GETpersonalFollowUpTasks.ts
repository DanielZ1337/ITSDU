import { ITSLEARNING_API_MAX_PAGESIZE, apiUrl } from "@/lib/utils.ts";
import { ItslearningRestApiEntitiesFollowUpTask } from "@/types/api-types/utils/Itslearning.RestApi.Entities.FollowUpTask.ts";

const GETpersonalFollowUpTasksApiEndpoint =
  "restapi/personal/tasks/followuptasks/v1?PageIndex={PageIndex}&PageSize={PageSize}";

export const GETpersonalFollowUpTasksApiUrl = (
  params: GETpersonalFollowUpTasksParams,
) => {
  return apiUrl(GETpersonalFollowUpTasksApiEndpoint, {
    PageIndex: params.PageIndex,
    PageSize: params.PageSize,
  });
};

export type GETpersonalFollowUpTasks = {
  EntityArray: ItslearningRestApiEntitiesFollowUpTask[];
  Total: number;
  CurrentPageIndex: number;
  PageSize: number;
};

export type GETpersonalFollowUpTasksParams = {
  PageIndex?: number;
  PageSize?: ITSLEARNING_API_MAX_PAGESIZE;
};
