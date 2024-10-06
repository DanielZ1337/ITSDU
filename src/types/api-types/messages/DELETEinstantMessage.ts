import { apiUrl } from "@/lib/utils.ts";

const DELETEinstantMessageApiEndpoint =
	"restapi/personal/instantmessages/{instantMessageId}/v1";

export const DELETEinstantMessageApiUrl = (
	params: DELETEinstantMessageParams,
) => {
	return apiUrl(DELETEinstantMessageApiEndpoint, {
		instantMessageId: params.instantMessageId,
	});
};

export type DELETEinstantMessageParams = {
	instantMessageId: number;
};
