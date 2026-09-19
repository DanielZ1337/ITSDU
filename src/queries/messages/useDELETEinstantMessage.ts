import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { getAccessToken } from "@/lib/utils";
import {
	DELETEinstantMessageApiUrl,
	DELETEinstantMessageParams,
} from "@/types/api-types/messages/DELETEinstantMessage.ts";
import { TanstackKeys } from "@/types/tanstack-keys";

export default function useDELETEinstantMessage(
	queryConfig?: UseMutationOptions<
		undefined,
		Error,
		DELETEinstantMessageParams,
		string[]
	>,
) {
	return useMutation({
		mutationKey: [TanstackKeys.DELETEinstantMessage],

		mutationFn: async (params) => {
			const res = await axios.delete(DELETEinstantMessageApiUrl(params), {
				params: {
					access_token: (await getAccessToken()) || "",
				},
			});

			if (res.status !== 200) throw new Error(res.statusText);

			return res.data;
		},

		...queryConfig,
	});
}
