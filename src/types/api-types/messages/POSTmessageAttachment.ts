import {apiUrl} from "@/lib/utils.ts";

const POSTmessageAttachmentApiEndpoint = 'restapi/personal/instantmessages/attachment/v1'

export const POSTmessageAttachmentApiUrl = () => apiUrl(POSTmessageAttachmentApiEndpoint)