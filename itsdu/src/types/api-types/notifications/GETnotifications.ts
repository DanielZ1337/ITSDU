import { apiUrl, ITSLEARNING_API_MAX_PAGESIZE } from "@/lib/utils";
import { ItslearningRestApiEntitiesNotification } from "@/types/api-types/utils/Itslearning.RestApi.Entities.Notification";

const GETnotificationsApiEndpoint =
	"restapi/personal/notifications/v2?UseNewerThan={UseNewerThan}&FromId={FromId}&PageIndex={PageIndex}&PageSize={PageSize}";

export const GETnotificationsApiUrl = (params: GETnotificationsParams) =>
	apiUrl(GETnotificationsApiEndpoint, params);

export type GETnotificationsParams = {
	FromId?: number;
	PageIndex?: number;
	PageSize?: ITSLEARNING_API_MAX_PAGESIZE;
	UseNewerThan?: boolean;
};

export type GETnotifications = {
	EntityArray: ItslearningRestApiEntitiesNotification[];
	Total: number;
	CurrentPageIndex: number;
	PageSize: number;
};
