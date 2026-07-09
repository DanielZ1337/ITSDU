import { useUser } from "@/hooks/atoms/useUser";
import { getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
	GETpreviousMessagesApiUrl,
	GETpreviousMessagesParams,
} from "@/types/api-types/AI/GETpreviousMessages.ts";
import {
	UseInfiniteQueryOptions,
	useInfiniteQuery,
} from "@tanstack/react-query";
import axios from "axios";
import { GETpreviousMessagesResponse } from "../../types/api-types/AI/GETpreviousMessages";
import { TanstackKeys } from "../../types/tanstack-keys";

export default function useGETpreviousMessages(
	params: Omit<GETpreviousMessagesParams, "userId">,
	queryConfig?: UseInfiniteQueryOptions<
		GETpreviousMessagesResponse,
		Error,
		GETpreviousMessagesResponse,
		GETpreviousMessagesResponse,
		string[]
	>,
) {
	const user = useUser();

	return useInfiniteQuery(
		[TanstackKeys.AIpreviousMessages, ...getQueryKeysFromParamsObject(params)],
		async ({ pageParam = params.pageIndex }) => {
			if (!user) throw new Error("User not found");

			const { elementId } = params;

			const previousMessages = await axios.get(
				GETpreviousMessagesApiUrl({
					elementId: Number(elementId),
					userId: user.PersonId,
					pageIndex: pageParam,
				}),
				{
					params: {
						elementId,
						userId: user.PersonId,
					},
				},
			);

			return previousMessages.data;
		},
		{
			...queryConfig,
			getNextPageParam: (lastPage) => {
				const { totalMessages, pageSize, pageIndex } = lastPage;
				const parsedTotalMessages = Number(totalMessages);
				const parsedPageSize = Number(pageSize);
				const parsedPageIndex = Number(pageIndex);
				if (parsedTotalMessages > parsedPageSize * parsedPageIndex) {
					return parsedPageIndex + 1;
				} else {
					return undefined;
				}
			},
		},
	);
}
