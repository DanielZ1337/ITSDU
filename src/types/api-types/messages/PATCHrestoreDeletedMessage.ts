import { apiUrl } from "@/lib/utils.ts";

const PATCHrestoreDeletedMessageApiEndpoint =
	"restapi/personal/instantmessages/{instantMessageId}/restore/v1";

export const PATCHrestoreDeletedMessageApiUrl = (
	params: PATCHrestoreDeletedMessageParams,
) => {
	return apiUrl(PATCHrestoreDeletedMessageApiEndpoint, {
		instantMessageId: params.instantMessageId,
	});
};

export type PATCHrestoreDeletedMessageParams = {
	instantMessageId: number;
};
