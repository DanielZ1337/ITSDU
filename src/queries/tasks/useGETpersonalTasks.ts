import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
	GETpersonalTasks,
	GETpersonalTasksApiUrl,
	GETpersonalTasksParams,
} from "@/types/api-types/tasks/GETpersonalTasks.ts";
import { TanstackKeys } from "@/types/tanstack-keys";
import axios from "axios";
import { QueryConfig, useQueryCompat } from "@/lib/query-compat";

export default function useGETpersonalTasks(
	params: GETpersonalTasksParams,
	queryConfig?: QueryConfig<
		GETpersonalTasks,
		Error,
		GETpersonalTasks,
		string[]
	>,
) {
	return useQueryCompat({
        queryKey: [TanstackKeys.PersonalTasks, ...getQueryKeysFromParamsObject(params)],

        queryFn: async () => {
			const res = await axios.get(
				GETpersonalTasksApiUrl({
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
