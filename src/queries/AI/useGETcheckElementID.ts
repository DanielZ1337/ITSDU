import { getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import { GETcheckElementIDApiUrl } from "@/types/api-types/AI/GETcheckElementID.ts";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { TanstackKeys } from "../../types/tanstack-keys";

export default function useGETcheckElementID(
	elementId: number | string,
	queryConfig?: UseQueryOptions<boolean, Error, boolean, string[]>,
) {
	return useQuery(
		[
			TanstackKeys.AICheckElementID,
			...getQueryKeysFromParamsObject({ elementId }),
		],
		async () => {
			const res = await axios.get(
				GETcheckElementIDApiUrl({
					elementId: Number(elementId),
				}),
				{
					params: {
						elementId,
					},
				},
			);

			const exists = res.status === 200;

			return exists;
		},
		{
			...queryConfig,
		},
	);
}
