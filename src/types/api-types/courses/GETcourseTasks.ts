import { ITSLEARNING_API_MAX_PAGESIZE, apiUrl } from "@/lib/utils.ts";
import { ItslearningRestApiEntitiesTaskStatusFilter } from "../utils/Itslearning.RestApi.Entities.TaskStatusFilter";
import { ItslearningRestApiEntitiesTaskDeadlineFilter } from "../utils/Itslearning.RestApi.Entities.TaskDeadlineFilter";
import { ItslearningRestApiEntitiesTask } from "../utils/Itslearning.RestApi.Entities.Task";

const GETcourseTasksApiEndpoint =
  "restapi/personal/tasks/v1?PageIndex={PageIndex}&PageSize={PageSize}&status={status}&deadline={deadline}&isHomework={isHomework}";

export const GETcourseTasksApiUrl = (params: GETcourseTasksParams) =>
  apiUrl(GETcourseTasksApiEndpoint, params);

export type GETcourseTasks = {
  EntityArray: ItslearningRestApiEntitiesTask[];
  Total: number;
  CurrentPageIndex: number;
  PageSize: number;
};

export type GETcourseTasksParams = {
  PageIndex?: number;
  PageSize?: ITSLEARNING_API_MAX_PAGESIZE;
  // technically, it should be ItslearningRestApiEntitiesTaskStatusFilter, but wrong documentation
  status?: keyof typeof ItslearningRestApiEntitiesTaskStatusFilter;
  deadline?: ItslearningRestApiEntitiesTaskDeadlineFilter;
  isHomework?: boolean;
};
