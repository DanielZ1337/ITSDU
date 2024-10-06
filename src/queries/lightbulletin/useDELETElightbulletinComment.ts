import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
	DELETElightbulletinComment,
	DELETElightbulletinCommentApiUrl,
	DELETElightbulletinCommentParams,
} from "@/types/api-types/lightbulletin/DELETElightbulletinComment.ts";
import { TanstackKeys } from "@/types/tanstack-keys";
import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import axios from "axios";

export default function useDELETElightbulletinComment(
	params: DELETElightbulletinCommentParams,
	queryConfig?: UseMutationOptions<
		DELETElightbulletinComment,
		Error,
		DELETElightbulletinCommentParams,
		string[]
	>,
) {
	return useMutation(
		[
			TanstackKeys.LightbulletinComment,
			...getQueryKeysFromParamsObject(params),
		],
		async () => {
			const res = await axios.delete(
				DELETElightbulletinCommentApiUrl({
					...params,
				}),
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
