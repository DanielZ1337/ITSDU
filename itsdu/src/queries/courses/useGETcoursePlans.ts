import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";
import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
	GETcoursePlans,
	GETcoursePlansApiUrl,
	GETcoursePlansParams,
} from "@/types/api-types/courses/GETcoursePlans.ts";
import { TanstackKeys } from "@/types/tanstack-keys";

export default function useGETcoursePlans(
	params: GETcoursePlansParams,
	queryConfig?: UseQueryOptions<
		GETcoursePlans,
		Error,
		GETcoursePlans,
		string[]
	>,
) {
	return useQuery(
		[TanstackKeys.CoursePlans, ...getQueryKeysFromParamsObject(params)],
		async () => {
			const res = await axios.get(
				GETcoursePlansApiUrl({
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
