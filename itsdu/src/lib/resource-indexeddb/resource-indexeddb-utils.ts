import { IndexedDBResourceFileType } from "./resourceIndexedDB";

export type SortOrder = "normal" | "reverse";

export function getSortedResourcesByTime(
	resources: IndexedDBResourceFileType[],
	sortOrder: SortOrder = "normal",
) {
	const sortedResources = resources.sort((a, b) => {
		const timeDiff = a.last_accessed.getTime() - b.last_accessed.getTime();

		return sortOrder === "normal" ? timeDiff : -timeDiff;
	});

	return sortedResources;
}
