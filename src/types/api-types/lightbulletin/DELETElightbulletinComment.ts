import { apiUrl } from "@/lib/utils.ts";
import { SystemNetHttpHttpResponseMessage } from "@/types/api-types/utils/System.Net.Http.HttpResponseMessage.ts";

const DELETElightbulletinCommentApiEndpoint =
	"restapi/personal/lightbulletins/comments/{commentId}/v1";

export const DELETElightbulletinCommentApiUrl = (
	params: DELETElightbulletinCommentParams,
) => {
	return apiUrl(DELETElightbulletinCommentApiEndpoint, {
		commentId: params.commentId,
	});
};

export type DELETElightbulletinComment = SystemNetHttpHttpResponseMessage;

export type DELETElightbulletinCommentParams = {
	commentId: number;
};
