import { ItslearningRestApiEntitiesNotificationType } from "@/types/api-types/utils/Itslearning.RestApi.Entities.NotificationType";
import { ItslearningRestApiEntitiesPersonSimple } from "@/types/api-types/utils/Itslearning.RestApi.Entities.PersonSimple";

export type ItslearningRestApiEntitiesNotification = {
	NotificationId: number;
	Text: string;
	PublishedDate: Date;
	PublishedBy: ItslearningRestApiEntitiesPersonSimple;
	Type: ItslearningRestApiEntitiesNotificationType;
	Url: string;
	ContentUrl: string;
	IsRead: boolean;
	IsAnonymous: boolean;
};
