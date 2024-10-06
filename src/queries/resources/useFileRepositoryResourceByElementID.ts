import { getSortedResourcesByTime } from "@/lib/resource-indexeddb/resource-indexeddb-utils";
import { ItsduResourcesDBWrapper } from "@/lib/resource-indexeddb/resourceIndexedDB";
import { getAccessToken } from "@/lib/utils";
import {
	GETcourseResourceInfo,
	GETcourseResourceInfoApiUrl,
} from "@/types/api-types/courses/GETcourseResourceInfo";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { FileRepository } from "electron/services/itslearning/resources/resources";
import { TanstackKeys } from "../../types/tanstack-keys";

export default function useFileRepositoryResourceByElementID(
	elementId: number | string,
	queryConfig?: UseQueryOptions<
		FileRepository,
		Error,
		FileRepository,
		string[]
	>,
) {
	return useQuery(
		[
			"fileRepositoryResourceByElementID",
			TanstackKeys.ResourceByElementID,
			elementId.toString(),
		],
		async () => {
			return await window.resources.file.getDirectFileRepository(elementId);
		},
		{
			...queryConfig,
			// complete caching of resources
			refetchInterval: false,
			refetchOnWindowFocus: false,
			refetchOnMount: false,
			refetchOnReconnect: false,
			refetchIntervalInBackground: false,
		},
	);
}
