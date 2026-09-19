import { QueryConfig, useQueryCompat } from "@/lib/query-compat";
import { TanstackKeys } from "../../types/tanstack-keys";

export default function useDirectFileUrlByElementID(
	elementId: number | string,
	queryConfig?: QueryConfig<string, Error, string, string[]>,
) {
	return useQueryCompat({
		queryKey: [
			"directFileUrlByElementID",
			TanstackKeys.ResourceByElementID,
			elementId.toString(),
		],

		queryFn: async () => {
			return await window.resources.file.getDirectUrl(elementId);
		},

		...queryConfig,

		// complete caching of resources
		refetchInterval: false,

		refetchOnWindowFocus: false,
		refetchOnMount: false,
		refetchOnReconnect: false,
		refetchIntervalInBackground: false,
	});
}
