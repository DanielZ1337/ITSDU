import {
	type CachedResourceStatus,
	ItsduResourcesDBWrapper,
	type ResourceCacheHealth,
} from "@/lib/resource-indexeddb/resourceIndexedDB";
import { useCallback, useEffect, useState } from "react";

export type CachedResourceSummary = {
	elementId: string;
	name: string;
	CourseTitle?: string;
	CourseId?: number;
	fileExtension?: string;
	mimeType?: string;
	openMode?: string;
	cacheStatus: CachedResourceStatus;
	size: number;
	last_accessed: Date;
	cachedAt?: Date;
	lastOpenedAt?: Date;
};

type UseCachedResourcesOptions = {
	limit?: number;
};

export function useCachedResources(options: UseCachedResourcesOptions = {}) {
	const { limit } = options;
	const [state, setState] = useState<{
		resources: CachedResourceSummary[];
		health: ResourceCacheHealth | null;
		isLoading: boolean;
		isError: boolean;
		error: unknown;
	}>({
		resources: [],
		health: null,
		isLoading: true,
		isError: false,
		error: undefined,
	});

	const load = useCallback(async () => {
		setState((current) => ({ ...current, isLoading: true, isError: false }));
		try {
			const db = await ItsduResourcesDBWrapper.getInstance();
			const all = await db.getAllResources();
			const health = await db.getCacheHealth();
			const sorted = all
				.sort(
					(a, b) =>
						new Date(b.lastOpenedAt ?? b.last_accessed).getTime() -
						new Date(a.lastOpenedAt ?? a.last_accessed).getTime(),
				)
				.map((resource) => ({
					elementId: resource.elementId,
					name:
						"name" in resource && typeof resource.name === "string"
							? resource.name
							: resource.elementId,
					CourseTitle: resource.CourseTitle,
					CourseId: resource.CourseId,
					fileExtension: resource.fileExtension,
					mimeType: resource.mimeType,
					openMode: resource.openMode,
					cacheStatus: resource.cacheStatus ?? "cached",
					size:
						"size" in resource && typeof resource.size === "number"
							? resource.size
							: 0,
					last_accessed: new Date(resource.last_accessed),
					cachedAt: resource.cachedAt ? new Date(resource.cachedAt) : undefined,
					lastOpenedAt: resource.lastOpenedAt
						? new Date(resource.lastOpenedAt)
						: undefined,
				}));
			setState({
				resources: limit ? sorted.slice(0, limit) : sorted,
				health,
				isLoading: false,
				isError: false,
				error: undefined,
			});
		} catch (error) {
			console.error(error);
			setState({
				resources: [],
				health: null,
				isLoading: false,
				isError: true,
				error,
			});
		}
	}, [limit]);

	useEffect(() => {
		let mounted = true;
		void (async () => {
			await load();
			if (!mounted) return;
		})();
		return () => {
			mounted = false;
		};
	}, [load]);

	const removeResource = useCallback(
		async (elementId: string) => {
			const db = await ItsduResourcesDBWrapper.getInstance();
			await db.deleteResourceById(elementId);
			await load();
		},
		[load],
	);

	const clearProblemResources = useCallback(async () => {
		const db = await ItsduResourcesDBWrapper.getInstance();
		const removed = await db.clearProblemResources();
		await load();
		return removed;
	}, [load]);

	return { ...state, refetch: load, removeResource, clearProblemResources };
}
