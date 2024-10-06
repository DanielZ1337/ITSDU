import { apiUrl } from "@/lib/utils.ts";

const PUTinstantMessageThreadUpdateIsReadApiEndpoint =
  "restapi/personal/instantmessages/messagethreads/{threadId}/updatelastread/{lastReadInstantMessageId}/v1";

export const PUTinstantMessageThreadUpdateIsReadApiUrl = (
  params: PUTinstantMessageThreadUpdateIsReadParams,
) => {
  return apiUrl(PUTinstantMessageThreadUpdateIsReadApiEndpoint, {
    threadId: params.threadId,
    lastReadInstantMessageId: params.lastReadInstantMessageId,
  });
};

export type PUTinstantMessageThreadUpdateIsReadParams = {
  threadId: number;
  lastReadInstantMessageId: number;
};
