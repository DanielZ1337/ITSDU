import { ItsduResourcesDBWrapper } from "@/lib/resource-indexeddb/resourceIndexedDB";

type CacheResourceInput = {
	elementId: number | string;
	title?: string;
	courseId?: number;
	courseTitle?: string;
};

export async function cacheResourceForOffline({
	elementId,
	title,
	courseId,
	courseTitle,
}: CacheResourceInput) {
	const db = await ItsduResourcesDBWrapper.getInstance();
	const file = await window.resources.file.get(elementId);
	const now = new Date();

	await db.insertResource({
		elementId: elementId.toString(),
		name: file.name || title || elementId.toString(),
		arrayBuffer: file.arrayBuffer,
		size: file.size,
		type: file.type,
		CourseId: courseId,
		CourseTitle: courseTitle,
		last_accessed: now,
		lastOpenedAt: now,
		cachedAt: now,
		cacheStatus: "cached",
	});

	const settings = await window.settings.getAll();
	await db.enforceMaxSize(settings.resourceCacheMaxSizeMb * 1024 * 1024);
}
