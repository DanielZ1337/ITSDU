import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
	POSTlightbulletinAddComment,
	POSTlightbulletinAddCommentApiUrl,
	POSTlightbulletinAddCommentBody,
	POSTlightbulletinAddCommentParams,
} from "@/types/api-types/lightbulletin/POSTlightbulletinAddComment.ts";
import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { TanstackKeys } from "../../types/tanstack-keys";

export default function usePOSTlightbulletinAddComment(
	params: POSTlightbulletinAddCommentParams,
	queryConfig?: UseMutationOptions<
		POSTlightbulletinAddComment,
		Error,
		POSTlightbulletinAddCommentBody,
		string[]
	>,
) {
	return useMutation(
		[
			TanstackKeys.LightbulletinAddComment,
			...getQueryKeysFromParamsObject(params),
		],
		async (body) => {
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
				},
			);

			if (res.status !== 200) throw new Error(res.statusText);

			return res.data;
		},
		{
			...queryConfig,
		},
	);
}
