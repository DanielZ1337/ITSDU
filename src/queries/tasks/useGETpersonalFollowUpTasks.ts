import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
	GETpersonalFollowUpTasks,
	GETpersonalFollowUpTasksApiUrl,
	GETpersonalFollowUpTasksParams,
} from "@/types/api-types/tasks/GETpersonalFollowUpTasks.ts";
import { TanstackKeys } from "@/types/tanstack-keys";
import axios from "axios";
import { QueryConfig, useQueryCompat } from "@/lib/query-compat";

export default function useGETpersonalFollowUpTasks(
	params: GETpersonalFollowUpTasksParams,
	queryConfig?: QueryConfig<
		GETpersonalFollowUpTasks,
		Error,
		GETpersonalFollowUpTasks,
		string[]
	>,
) {
	return useQueryCompat({
        queryKey: [
			TanstackKeys.PersonalFollowUpTasks,
			...getQueryKeysFromParamsObject(params),
		],

        queryFn: async () => {
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

        ...queryConfig
    });
}
