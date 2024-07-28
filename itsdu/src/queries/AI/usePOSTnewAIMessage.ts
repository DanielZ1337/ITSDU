import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import axios from "axios";
import { TanstackKeys } from "@/types/tanstack-keys";
import {
	POSTnewAIMessageApiUrl,
	POSTnewAIMessageBody,
	POSTnewAIMessageParams,
} from "@/types/api-types/AI/POSTnewAIMessage";
import { getQueryKeysFromParamsObject } from "@/lib/utils";

export default function usePOSTnewAIMessage(
	params: POSTnewAIMessageParams,
	queryConfig?: UseMutationOptions<any, Error, any, string[]>,
) {
	return useMutation({
		mutationKey: [
			TanstackKeys.AInewMessage,
			...getQueryKeysFromParamsObject(params),
		],
		mutationFn: async (body: POSTnewAIMessageBody) => {
			const res = await axios.post(POSTnewAIMessageApiUrl(params), body, {
				params: {
					...params,
				},
			});

			console.log(res);

			if (res.status !== 200) throw new Error(res.statusText);

			return res.data;
		},
		...queryConfig,
	});
}
