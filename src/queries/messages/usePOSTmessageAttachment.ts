import { getAccessToken } from "@/lib/utils";
import {
  POSTmessageAttachment,
  POSTmessageAttachmentApiUrl,
} from "@/types/api-types/messages/POSTmessageAttachment.ts";
import { TanstackKeys } from "@/types/tanstack-keys";
import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import axios from "axios";

export default function usePOSTmessageAttachment(
  queryConfig?: UseMutationOptions<POSTmessageAttachment, Error, File[], string[]>,
) {
  return useMutation(
    [TanstackKeys.POSTmessageAttachment],
    async (files) => {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append(`${file.name}`, file);
      });
      const res = await axios.post(POSTmessageAttachmentApiUrl(), formData, {
        params: {
          access_token: await getAccessToken(),
        },
      });

      console.log(res);

      if (res.status !== 200) throw new Error(res.statusText);

      return res.data;
    },
    {
      ...queryConfig,
    },
  );
}
