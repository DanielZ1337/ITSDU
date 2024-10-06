import { apiUrl } from "@/lib/utils.ts";

const POSTmessageAttachmentApiEndpoint =
	"restapi/personal/instantmessages/attachment/v1";

export const POSTmessageAttachmentApiUrl = () =>
	apiUrl(POSTmessageAttachmentApiEndpoint);

export type POSTmessageAttachmentApiBody = FormData;

export type POSTmessageAttachment = {
	m_Item1: string;
	m_Item2: string;
}[];
