import { TanstackKeys } from "@/types/tanstack-keys";
import { QueryConfig, useQueryCompat } from "@/lib/query-compat";

export default function useGETMediaDocument(
	elementId: number | string,
	queryConfig?: QueryConfig<string, Error, string, string[]>,
) {
	return useQueryCompat({
        queryKey: [TanstackKeys.ResourceMediaByElementID, String(elementId)],

        queryFn: async () => {
			const mediaLink = await window.resources.media.get(elementId);

			if (!mediaLink) throw new Error("Media link not found");

			return mediaLink;
		},

        ...queryConfig,

        // complete caching of resources
        refetchInterval: false,

        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchIntervalInBackground: false
    });
}
