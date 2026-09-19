import axios from "axios";
import { QueryConfig, useQueryCompat } from "@/lib/query-compat";
import { getQueryKeysFromParamsObject } from "@/lib/utils.ts";
import { GETcheckElementIDApiUrl } from "@/types/api-types/AI/GETcheckElementID.ts";
import { TanstackKeys } from "../../types/tanstack-keys";

export default function useGETcheckElementID(
	elementId: number | string,
	queryConfig?: QueryConfig<boolean, Error, boolean, string[]>,
) {
	return useQueryCompat({
		queryKey: [
			TanstackKeys.AICheckElementID,
			...getQueryKeysFromParamsObject({ elementId }),
		],

		queryFn: async () => {
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

		...queryConfig,
	});
}
