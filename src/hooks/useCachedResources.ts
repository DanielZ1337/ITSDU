import { ItsduResourcesDBWrapper } from "@/lib/resource-indexeddb/resourceIndexedDB";
import { useCallback, useEffect, useState } from "react";

export type CachedResourceSummary = {
	elementId: string;
	name: string;
	CourseTitle?: string;
	size: number;
	last_accessed: Date;
};

type UseCachedResourcesOptions = {
	limit?: number;
};

export function useCachedResources(options: UseCachedResourcesOptions = {}) {
	const { limit } = options;
	const [state, setState] = useState<{
		resources: CachedResourceSummary[];
		isLoading: boolean;
		isError: boolean;
		error: unknown;
	}>({ resources: [], isLoading: true, isError: false, error: undefined });

	const load = useCallback(async () => {
		setState((current) => ({ ...current, isLoading: true, isError: false }));
		try {
			const db = await ItsduResourcesDBWrapper.getInstance();
			const all = await db.getAllResources();
			const sorted = all
				.sort(
					(a, b) =>
						new Date(b.last_accessed).getTime() -
						new Date(a.last_accessed).getTime(),
				)
				.map((resource) => ({
					elementId: resource.elementId,
					name:
						"name" in resource && typeof resource.name === "string"
							? resource.name
							: resource.elementId,
					CourseTitle: resource.CourseTitle,
					size:
						"size" in resource && typeof resource.size === "number"
							? resource.size
							: 0,
					last_accessed: new Date(resource.last_accessed),
				}));
			setState({
				resources: limit ? sorted.slice(0, limit) : sorted,
				isLoading: false,
				isError: false,
				error: undefined,
			});
		} catch (error) {
			console.error(error);
			setState({ resources: [], isLoading: false, isError: true, error });
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

	return { ...state, refetch: load, removeResource };
}
