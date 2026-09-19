import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
	GETpersonalTasklistDailyWorkflow,
	GETpersonalTasklistDailyWorkflowApiUrl,
	GETpersonalTasklistDailyWorkflowParams,
} from "@/types/api-types/tasks/GETpersonalTasklistDailyWorkflow";
import { TanstackKeys } from "@/types/tanstack-keys";
import axios from "axios";
import { QueryConfig, useQueryCompat } from "@/lib/query-compat";

export default function useGETpersonalTasklistDailyWorkflow(
	params: GETpersonalTasklistDailyWorkflowParams,
	queryConfig?: QueryConfig<
		GETpersonalTasklistDailyWorkflow,
		Error,
		GETpersonalTasklistDailyWorkflow,
		string[]
	>,
) {
	return useQueryCompat({
        queryKey: [
			TanstackKeys.PersonalTasklistDailyWorkflow,
			...getQueryKeysFromParamsObject(params),
		],

        queryFn: async () => {
			const res = await axios.get(
				GETpersonalTasklistDailyWorkflowApiUrl({
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
