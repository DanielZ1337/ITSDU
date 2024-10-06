import { apiUrl } from "@/lib/utils.ts";
import { ItslearningRestApiEntitiesInstantMessageRecipient } from "@/types/api-types/utils/Itslearning.RestApi.Entities.InstantMessageRecipient.ts";
import { ItslearningRestApiEntitiesInstantMessageRecipientRole } from "@/types/api-types/utils/Itslearning.RestApi.Entities.InstantMessageRecipientRole.ts";

const GETinstantMessagesRecipientsSearchApiEndpoint =
	"restapi/personal/instantmessages/recipients/search/v1?searchText={searchText}&instantMessageThreadId={instantMessageThreadId}&recipientRoles[0]={recipientRoles[0]}&recipientRoles[1]={recipientRoles[1]}";

export const GETinstantMessagesRecipientsSearchApiUrl = (
	params: GETinstantMessagesRecipientsSearchParams,
) => {
	return apiUrl(GETinstantMessagesRecipientsSearchApiEndpoint, {
		searchText: params.searchText,
		instantMessageThreadId: params.instantMessageThreadId,
		recipientRoles: params.recipientRoles,
	});
};

export type GETinstantMessagesRecipientsSearch =
	ItslearningRestApiEntitiesInstantMessageRecipient[];

export type GETinstantMessagesRecipientsSearchParams = {
	searchText: string;
	instantMessageThreadId?: number;
	recipientRoles?: ItslearningRestApiEntitiesInstantMessageRecipientRole[];
};
