import { QueryConfig, useQueryCompat } from "@/lib/query-compat";
import type { FileRepository } from "../../../electron/services/itslearning/resources/resources";
import { TanstackKeys } from "../../types/tanstack-keys";

export default function useFileRepositoryResourceByElementID(
	elementId: number | string,
	queryConfig?: QueryConfig<FileRepository, Error, FileRepository, string[]>,
) {
	return useQueryCompat({
		queryKey: [
			"fileRepositoryResourceByElementID",
			TanstackKeys.ResourceByElementID,
			elementId.toString(),
		],

		queryFn: async () => {
			return await window.resources.file.getDirectFileRepository(elementId);
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
