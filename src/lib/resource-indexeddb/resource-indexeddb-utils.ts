import { IndexedDBResourceFileType } from "./resourceIndexedDB";

export type SortOrder = "normal" | "reverse";

export function getSortedResourcesByTime(
	resources: IndexedDBResourceFileType[],
	sortOrder: SortOrder = "normal",
) {
	const sortedResources = resources.sort((a, b) => {
		const timeDiff =
			new Date(a.lastOpenedAt ?? a.last_accessed).getTime() -
			new Date(b.lastOpenedAt ?? b.last_accessed).getTime();

		return sortOrder === "normal" ? timeDiff : -timeDiff;
	});

	return sortedResources;
}
