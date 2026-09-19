import { TanstackKeys } from "../../types/tanstack-keys";
import { QueryConfig, useQueryCompat } from "@/lib/query-compat";

type OfficeDocument = {
	accessToken: string;
	downloadUrl: string;
};

export default function useOfficeDocumentByElementId(
	elementId: number | string,
	queryConfig?: QueryConfig<
		OfficeDocument,
		Error,
		OfficeDocument,
		string[]
	>,
) {
	return useQueryCompat({
        queryKey: [TanstackKeys.ResourceOfficeDocumentByElementID, elementId.toString()],

        queryFn: async () => {
			return await window.resources.officeDocuments.get(elementId);
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
