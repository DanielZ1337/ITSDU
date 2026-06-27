import { ItsduResourcesDBWrapper } from "@/lib/resource-indexeddb/resourceIndexedDB";
import { fileExtension } from "@/lib/resources/resource-format";
import { getAccessToken } from "@/lib/utils";
import {
	GETcourseResourceInfo,
	GETcourseResourceInfoApiUrl,
} from "@/types/api-types/courses/GETcourseResourceInfo";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { TanstackKeys } from "../../types/tanstack-keys";

export type ResourceFileType = {
	name: string;
	arrayBuffer: ArrayBuffer;
	size: number;
	type: string;
	url: string;
	text: string;
	stream: ReadableStream;
	blob: Blob;
	fromCache?: boolean;
	offlineFallback?: boolean;
	cacheStatus?: "cached" | "missing" | "stale" | "failed";
	CourseTitle?: string;
	CourseId?: number;
};

function createRenderableResource(
	resource: {
		name: string;
		arrayBuffer?: ArrayBuffer | Uint8Array;
		size: number;
		type: string;
		CourseTitle?: string;
		CourseId?: number;
		cacheStatus?: ResourceFileType["cacheStatus"];
	},
	options: { fromCache?: boolean; offlineFallback?: boolean } = {},
) {
	const arrayBuffer =
		resource.arrayBuffer instanceof ArrayBuffer
			? resource.arrayBuffer
			: resource.arrayBuffer
				? new Uint8Array(
						resource.arrayBuffer.buffer,
						resource.arrayBuffer.byteOffset,
						resource.arrayBuffer.byteLength,
					).slice().buffer
				: new ArrayBuffer(0);
	const blob = new Blob([arrayBuffer], {
		type: resource.type,
	});
	const url = URL.createObjectURL(blob);
	const stream = blob.stream();

	return blob.text().then((text) => ({
		...resource,
		arrayBuffer,
		url,
		text,
		stream,
		blob,
		fromCache: options.fromCache,
		offlineFallback: options.offlineFallback,
	}));
}

function shouldCacheOpenedResource(
	mode: Awaited<ReturnType<typeof window.settings.getAll>>["resourceCacheMode"],
	file: { name: string; type?: string },
) {
	if (mode === "manual") return false;
	if (mode === "opened") return true;
	if (mode === "pdf-only") {
		return (
			file.type === "application/pdf" || fileExtension(file.name) === "pdf"
		);
	}
	return false;
}

function offlineResourceError(elementId: number | string) {
	return new Error(
		`Resource ${elementId} is not available offline. Connect to the internet and try again.`,
	);
}

export default function useResourceByElementID(
	elementId: number | string,
	queryConfig?: UseQueryOptions<
		ResourceFileType,
		Error,
		ResourceFileType,
		string[]
	>,
) {
	return useQuery(
		[TanstackKeys.ResourceByElementID, elementId.toString()],
		async () => {
			const db = await ItsduResourcesDBWrapper.getInstance();
			const resource = await db.getResourceById(elementId.toString());
			const last_accessed = new Date();

			if (resource?.arrayBuffer && resource.cacheStatus !== "failed") {
				void db.getIndexedDB().updateData(elementId.toString(), {
					last_accessed,
					lastOpenedAt: last_accessed,
					cacheStatus: "cached",
				});

				return createRenderableResource(resource, { fromCache: true });
			}

			if (!navigator.onLine) {
				throw offlineResourceError(elementId);
			}

			let file: Awaited<ReturnType<typeof window.resources.file.get>>;
			try {
				file = await window.resources.file.get(elementId);
			} catch (error) {
				if (resource?.arrayBuffer) {
					return createRenderableResource(resource, {
						fromCache: true,
						offlineFallback: true,
					});
				}
				throw error instanceof Error ? error : offlineResourceError(elementId);
			}
			let resourceInfo: { CourseTitle?: string; CourseId?: number } = {};
			try {
				const resourceInfoResponse = (
					await axios.get(
						GETcourseResourceInfoApiUrl({
							resourceId: Number(elementId),
						}),
						{
							params: {
								access_token: await getAccessToken(),
							},
						},
					)
				).data as GETcourseResourceInfo;
				resourceInfo = {
					CourseTitle: resourceInfoResponse.CourseTitle,
					CourseId: resourceInfoResponse.CourseId,
				};
			} catch (error) {
				console.error("Failed to read resource metadata:", error);
			}

			const insertResourceObject = {
				elementId: elementId.toString(),
				last_accessed,
				lastOpenedAt: last_accessed,
				cachedAt: last_accessed,
				cacheStatus: "cached" as const,
				...file,
				...resourceInfo,
			};

			const settings = await window.settings.getAll();
			if (shouldCacheOpenedResource(settings.resourceCacheMode, file)) {
				await db.getIndexedDB().checkRemainingSpace(file.size / 1024 / 1024, {
					onStorageAvailable: async () => {
						await db.insertResource(insertResourceObject);
						await db.enforceMaxSize(
							settings.resourceCacheMaxSizeMb * 1024 * 1024,
						);
					},
					onStorageUnavailable: async () => {
						await db.insertResource(insertResourceObject);
						await db.enforceMaxSize(
							settings.resourceCacheMaxSizeMb * 1024 * 1024,
						);
					},
				});
			}

			return createRenderableResource(
				{
					...file,
					...resourceInfo,
					cacheStatus: shouldCacheOpenedResource(
						settings.resourceCacheMode,
						file,
					)
						? "cached"
						: "missing",
				},
				{ fromCache: false },
			);
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
