import { apiUrl } from "@/lib/utils.ts";

const PUTinstantMessageThreadApiEndpoint =
	"restapi/personal/instantmessages/messagethreads/{threadId}/v1";

export const PUTinstantMessageThreadApiUrl = (
	params: PUTinstantMessageThreadParams,
) => {
	return apiUrl(PUTinstantMessageThreadApiEndpoint, {
		threadId: params.threadId,
	});
};

export type PUTinstantMessageThreadParams = {
	threadId: number;
};

export type PUTinstantMessageThreadBody = {
	InstantMessageThreadId?: number;
	UpdateName?: boolean;
	UpdateParticipants?: boolean;
	Name?: string;
	PersonIds?: number[];
	ToggleEnableDisableReplies?: boolean;
	RepliesAreEnabled?: boolean;
};
