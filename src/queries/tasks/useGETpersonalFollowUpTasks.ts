import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
	GETpersonalFollowUpTasks,
	GETpersonalFollowUpTasksApiUrl,
	GETpersonalFollowUpTasksParams,
} from "@/types/api-types/tasks/GETpersonalFollowUpTasks.ts";
import { TanstackKeys } from "@/types/tanstack-keys";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function useGETpersonalFollowUpTasks(
	params: GETpersonalFollowUpTasksParams,
	queryConfig?: UseQueryOptions<
		GETpersonalFollowUpTasks,
		Error,
		GETpersonalFollowUpTasks,
		string[]
	>,
) {
	return useQuery(
		[
			TanstackKeys.PersonalFollowUpTasks,
			...getQueryKeysFromParamsObject(params),
		],
		async () => {
			const res = await axios.get(
				GETpersonalFollowUpTasksApiUrl({
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
