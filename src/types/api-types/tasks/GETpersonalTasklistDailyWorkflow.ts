import { ITSLEARNING_API_MAX_PAGESIZE, apiUrl } from "@/lib/utils.ts";
import { ItslearningRestApiEntitiesTaskDailyWorkflowSection } from "@/types/api-types/utils/Itslearning.RestApi.Entities.TaskDailyWorkflowSection.ts";

const GETpersonalTasklistDailyWorkflowApiEndpoint =
	"restapi/personal/tasklistdailyworkflow/v1?PageIndex={PageIndex}&PageSize={PageSize}";

export const GETpersonalTasklistDailyWorkflowApiUrl = (
	params: GETpersonalTasklistDailyWorkflowParams,
) => {
	return apiUrl(GETpersonalTasklistDailyWorkflowApiEndpoint, {
		PageIndex: params.PageIndex,
		PageSize: params.PageSize,
	});
};

export type GETpersonalTasklistDailyWorkflow = {
	EntityArray: ItslearningRestApiEntitiesTaskDailyWorkflowSection[];
	Total: number;
	CurrentPageIndex: number;
	PageSize: number;
};

export type GETpersonalTasklistDailyWorkflowParams = {
	PageIndex?: number;
	PageSize?: ITSLEARNING_API_MAX_PAGESIZE;
};
