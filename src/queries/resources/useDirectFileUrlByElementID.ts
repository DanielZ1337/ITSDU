import { getSortedResourcesByTime } from "@/lib/resource-indexeddb/resource-indexeddb-utils";
import { ItsduResourcesDBWrapper } from "@/lib/resource-indexeddb/resourceIndexedDB";
import { getAccessToken } from "@/lib/utils";
import {
	GETcourseResourceInfo,
	GETcourseResourceInfoApiUrl,
} from "@/types/api-types/courses/GETcourseResourceInfo";
import axios from "axios";
import type { FileRepository } from "electron/services/itslearning/resources/resources";
import { TanstackKeys } from "../../types/tanstack-keys";
import { QueryConfig, useQueryCompat } from "@/lib/query-compat";

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
        refetchIntervalInBackground: false
    });
}
