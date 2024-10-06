import { apiUrl } from "@/lib/utils";

const PUTnotificationsMarkAllAsReadApiEndpoint =
  "restapi/personal/notifications/seenmark/all/v1";

export const PUTnotificationsMarkAllAsReadApiUrl = () =>
  apiUrl(PUTnotificationsMarkAllAsReadApiEndpoint);
