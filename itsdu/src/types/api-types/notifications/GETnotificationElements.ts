import { apiUrl, ITSLEARNING_API_MAX_PAGESIZE } from "@/lib/utils";
import { ItslearningRestApiEntitiesElementLink } from "../utils/Itslearning.RestApi.Entities.ElementLink";

const GETnotificationElementsApiEndpoint =
	"restapi/personal/notifications/{notificationId}/elements/v1?PageIndex={PageIndex}&PageSize={PageSize}";

export const GETnotificationElementsApiUrl = (
	params: GETnotificationElementsParams,
) => apiUrl(GETnotificationElementsApiEndpoint, params);

export type GETnotificationElementsParams = {
	notificationId: number;
	PageIndex?: number;
	PageSize?: ITSLEARNING_API_MAX_PAGESIZE;
};

export type GETnotificationElements = {
	EntityArray: ItslearningRestApiEntitiesElementLink[];
	Total: number;
	CurrentPageIndex: number;
	PageSize: number;
};
