import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
  POSTlightbulletinAddComment,
  POSTlightbulletinAddCommentApiUrl,
  POSTlightbulletinAddCommentBody,
  POSTlightbulletinAddCommentParams,
} from "@/types/api-types/lightbulletin/POSTlightbulletinAddComment.ts";
import axios from "axios";
import { TanstackKeys } from "../../types/tanstack-keys";

export default function usePOSTlightbulletinAddComment(
  params: POSTlightbulletinAddCommentParams,
  queryConfig?: UseMutationOptions<
    POSTlightbulletinAddComment,
    Error,
    POSTlightbulletinAddCommentBody,
    string[]
  >
) {
  return useMutation({
    mutationKey: [
      TanstackKeys.LightbulletinAddComment,
      ...getQueryKeysFromParamsObject(params),
    ],
    mutationFn: async (body) => {
      const res = await axios.post(
        POSTlightbulletinAddCommentApiUrl({
          ...params,
        }),
        body,
        {
          params: {
            access_token: (await getAccessToken()) || "",
            ...params,
          },
        }
      );

      if (res.status !== 200) throw new Error(res.statusText);

      return res.data;
    },
    ...queryConfig,
  });
}
