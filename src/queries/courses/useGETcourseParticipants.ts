import axios from "axios";
import { QueryConfig, useQueryCompat } from "@/lib/query-compat";
import { getAccessToken, getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import {
	GETcourseParticipants,
	GETcourseParticipantsApiUrl,
	GETcourseParticipantsParams,
} from "@/types/api-types/courses/GETcourseParticipants.ts";
import { TanstackKeys } from "@/types/tanstack-keys";

export default function useGETcourseParticipants(
	params: GETcourseParticipantsParams,
	queryConfig?: QueryConfig<
		GETcourseParticipants,
		Error,
		GETcourseParticipants,
		string[]
	>,
) {
	const fetchAllPages = async (
		accumulatedData: GETcourseParticipants["EntityArray"] = [],
		pageIndex = 0,
	): Promise<GETcourseParticipants> => {
		const res = await axios.get(
			GETcourseParticipantsApiUrl({
				...params,
				PageIndex: pageIndex,
			}),
			{
				params: {
					access_token: (await getAccessToken()) || "",
					...params,
				},
			},
		);

		if (res.status !== 200) throw new Error(res.statusText);

		const currentData = res.data.EntityArray;
		const combinedData = [...accumulatedData, ...currentData];

		if (res.data.Total > res.data.PageSize * (pageIndex + 1)) {
			return fetchAllPages(combinedData, pageIndex + 1);
		}

		return {
			...res.data,
			EntityArray: combinedData,
		};
	};

	return useQueryCompat({
		queryKey: [
			TanstackKeys.CourseParticipants,
			...getQueryKeysFromParamsObject(params),
		],
		queryFn: () => fetchAllPages(),
		...queryConfig,
	});
}
