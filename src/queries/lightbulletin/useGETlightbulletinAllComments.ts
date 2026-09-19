import axios from "axios";
import { QueryConfig, useQueryCompat } from "@/lib/query-compat";
import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
	GETlightbulletinAllComments,
	GETlightbulletinAllCommentsApiUrl,
	GETlightbulletinAllCommentsParams,
} from "@/types/api-types/lightbulletin/GETlightbulletinAllComments.ts";
import { TanstackKeys } from "../../types/tanstack-keys";

export default function useGETlightbulletinAllComments(
	params: GETlightbulletinAllCommentsParams,
	queryConfig?: QueryConfig<
		GETlightbulletinAllComments,
		Error,
		GETlightbulletinAllComments,
		string[]
	>,
) {
	return useQueryCompat({
		queryKey: [
			TanstackKeys.LightbulletinAllComments,
			...getQueryKeysFromParamsObject(params),
		],

		queryFn: async () => {
			const res = await axios.get(
				GETlightbulletinAllCommentsApiUrl({
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

		...queryConfig,
	});
}
