import { apiUrl } from "@/lib/utils.ts";
import { SystemNetHttpHttpResponseMessage } from "@/types/api-types/utils/System.Net.Http.HttpResponseMessage.ts";

const PUTlightbulletinNotificationsApiEndpoint =
	"restapi/personal/lightbulletins/{lightBulletinId}/comments/subscription/v1";

export const PUTlightbulletinNotificationsApiUrl = (
	params: PUTlightbulletinNotificationsParams,
) => {
	return apiUrl(PUTlightbulletinNotificationsApiEndpoint, {
		lightBulletinId: params.lightbulletinId,
	});
};

export type PUTlightbulletinNotifications = SystemNetHttpHttpResponseMessage;

export type PUTlightbulletinNotificationsParams = {
	lightbulletinId: number;
};

export type PUTlightbulletinNotificationsBody = {
	isSubscribed: boolean;
};
