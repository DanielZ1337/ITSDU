import { apiUrl } from "@/lib/utils";

const PUTnotificationsMarkAsReadv2ApiEndpoint =
	"restapi/personal/notifications/v2";

export const PUTnotificationsMarkAsReadApiUrl = () =>
	apiUrl(PUTnotificationsMarkAsReadv2ApiEndpoint);

export type PUTnotificationsMarkAsReadv2Body = Array<{
	NotificationId: number | string;
	IsRead?: boolean;
}>;
