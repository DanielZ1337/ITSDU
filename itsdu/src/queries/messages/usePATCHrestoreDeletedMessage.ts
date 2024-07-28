import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import axios from "axios";
import {
	PATCHrestoreDeletedMessageApiUrl,
	PATCHrestoreDeletedMessageParams,
} from "@/types/api-types/messages/PATCHrestoreDeletedMessage.ts";
import { TanstackKeys } from "@/types/tanstack-keys";
import { getAccessToken } from "@/lib/utils";

export default function usePATCHrestoreDeletedMessage(
	queryConfig?: UseMutationOptions<
		undefined,
		Error,
		PATCHrestoreDeletedMessageParams,
		string[]
	>,
) {
	return useMutation(
		[TanstackKeys.PATCHrestoreDeletedMessage],
		async (params) => {
			const res = await axios.patch(
				PATCHrestoreDeletedMessageApiUrl(params),
				{},
				{
					params: {
						access_token: (await getAccessToken()) || "",
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
