import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
	GETcoursePlansTopics,
	GETcoursePlansTopicsApiUrl,
	GETcoursePlansTopicsParams,
} from "@/types/api-types/courses/GETcoursePlansTopics.ts";
import { TanstackKeys } from "@/types/tanstack-keys";
import axios from "axios";
import { QueryConfig, useQueryCompat } from "@/lib/query-compat";

export default function useGETcoursePlansTopics(
	params: GETcoursePlansTopicsParams,
	queryConfig?: QueryConfig<
		GETcoursePlansTopics,
		Error,
		GETcoursePlansTopics,
		string[]
	>,
) {
	return useQueryCompat({
        queryKey: [TanstackKeys.CoursePlansTopics, ...getQueryKeysFromParamsObject(params)],

        queryFn: async () => {
			const res = await axios.get(
				GETcoursePlansTopicsApiUrl({
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
