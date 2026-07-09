import { getQueryKeysFromParamsObject } from "@/lib/utils";
import {
	POSTnewAIMessageApiUrl,
	POSTnewAIMessageBody,
	POSTnewAIMessageParams,
} from "@/types/api-types/AI/POSTnewAIMessage";
import { TanstackKeys } from "@/types/tanstack-keys";
import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import axios from "axios";

export default function usePOSTnewAIMessage(
	params: POSTnewAIMessageParams,
	queryConfig?: UseMutationOptions<any, Error, any, string[]>,
) {
	return useMutation(
		[TanstackKeys.AInewMessage, ...getQueryKeysFromParamsObject(params)],
		async (body: POSTnewAIMessageBody) => {
			const res = await axios.post(POSTnewAIMessageApiUrl(params), body, {
				params: {
					...params,
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
