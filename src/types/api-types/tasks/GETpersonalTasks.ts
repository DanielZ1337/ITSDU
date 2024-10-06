import { ITSLEARNING_API_MAX_PAGESIZE, apiUrl } from "@/lib/utils.ts";
import { ItslearningRestApiEntitiesTask } from "@/types/api-types/utils/Itslearning.RestApi.Entities.Task.ts";
import { ItslearningRestApiEntitiesTaskDeadlineFilter } from "@/types/api-types/utils/Itslearning.RestApi.Entities.TaskDeadlineFilter.ts";
import { ItslearningRestApiEntitiesTaskStatusFilter } from "@/types/api-types/utils/Itslearning.RestApi.Entities.TaskStatusFilter.ts";

const GETpersonalTasksApiEndpoint =
  'restapi/personal/tasks/v1?PageIndex={PageIndex}&PageSize={PageSize}&status={status}&deadline={deadline}&isHomework={isHomework}import {apiUrl} from "@/lib/utils.ts";';

export const GETpersonalTasksApiUrl = (params: GETpersonalTasksParams) => {
  return apiUrl(GETpersonalTasksApiEndpoint, {
    PageIndex: params.PageIndex,
    PageSize: params.PageSize,
    status: params.status,
    deadline: params.deadline,
    isHomework: params.isHomework,
  });
};

export type GETpersonalTasks = {
  EntityArray: ItslearningRestApiEntitiesTask[];
  Total: number;
  CurrentPageIndex: number;
  PageSize: number;
};

export type GETpersonalTasksParams = {
  PageIndex?: number;
  PageSize?: ITSLEARNING_API_MAX_PAGESIZE;
  status?: ItslearningRestApiEntitiesTaskStatusFilter;
  deadline?: ItslearningRestApiEntitiesTaskDeadlineFilter;
  isHomework?: boolean;
};
