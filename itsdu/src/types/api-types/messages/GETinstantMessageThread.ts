import { apiUrl } from "@/lib/utils";
import { ItslearningRestApiEntitiesInstantMessageThread } from "../utils/Itslearning.RestApi.Entities.InstantMessageThread";

const GETinstantMessageThreadApiEndpoint =
	"restapi/personal/instantmessages/messagethreads/{threadId}/v2?maxMessages={maxMessages}&upperBoundInstantMessageId={upperBoundInstantMessageId}&lowerBoundInstantMessageId={lowerBoundInstantMessageId}";

export const GETinstantMessageThreadApiUrl = (
	params: GETinstantMessageThreadParams,
) => {
	return apiUrl(GETinstantMessageThreadApiEndpoint, {
		threadId: params.threadId,
		maxMessages: params.maxMessages,
		upperBoundInstantMessageId: params.upperBoundInstantMessageId,
		lowerBoundInstantMessageId: params.lowerBoundInstantMessageId,
	});
};

export type GETinstantMessageThread =
	ItslearningRestApiEntitiesInstantMessageThread;

export type GETinstantMessageThreadParams = {
	threadId: number;
	maxMessages?: number;
	upperBoundInstantMessageId?: number;
	lowerBoundInstantMessageId?: number;
};
