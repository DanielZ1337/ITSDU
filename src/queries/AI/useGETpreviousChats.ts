import { useUser } from "@/hooks/atoms/useUser";
import { getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
	GETpreviousChatsApiUrl,
	GETpreviousChatsParams,
	GETpreviousChatsResponse,
} from "@/types/api-types/AI/GETpreviousChats.ts";
import axios from "axios";
import { TanstackKeys } from "../../types/tanstack-keys";
import { InfiniteQueryConfig, useInfiniteQueryCompat } from "@/lib/query-compat";

export default function useGETpreviousChats(
	params?: Omit<GETpreviousChatsParams, "userId">,
	queryConfig?: InfiniteQueryConfig<GETpreviousChatsResponse>,
) {
	const user = useUser();

	return useInfiniteQueryCompat({
		queryKey: [
			TanstackKeys.AIpreviousMessages,
			...getQueryKeysFromParamsObject(params ?? {}),
		],
		queryFn: async ({ pageParam }) => {
			if (!user) throw new Error("User not found");

			const previousMessages = await axios.get(
				GETpreviousChatsApiUrl({
					userId: user.PersonId,
					pageIndex: pageParam,
				}),
				{
					params: {
						userId: user.PersonId,
					},
				},
			);

			return previousMessages.data;
		},
		initialPageParam: params?.pageIndex,
		...queryConfig,
		getNextPageParam: (lastPage) => {
				const { totalFiles, pageSize, pageIndex } = lastPage;
				const parsedTotalMessages = Number(totalFiles);
				const parsedPageSize = Number(pageSize);
				const parsedPageIndex = Number(pageIndex);
				if (parsedTotalMessages > parsedPageSize * parsedPageIndex) {
					return parsedPageIndex + 1;
				} else {
					return undefined;
				}
			},
	});
}
