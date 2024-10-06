import { apiUrl } from "@/lib/utils";

const GETunreadInstantMessagesCountApiEndpoint =
  "restapi/personal/instantmessages/messagethreads/unread/count/v1";

export type GETunreadInstantMessagesCount = number;

export const GETunreadInstantMessagesCountApiUrl = () => {
  return apiUrl(GETunreadInstantMessagesCountApiEndpoint);
};
