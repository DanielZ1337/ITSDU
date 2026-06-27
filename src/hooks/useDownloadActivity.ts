import {
	type DownloadActivityEntry,
	downloadActivityAtom,
} from "@/atoms/download-activity";
import { useAtom } from "jotai";
import { useCallback, useEffect } from "react";

const MAX_ENTRIES = 20;

export function useDownloadActivity() {
	const [entries, setEntries] = useAtom(downloadActivityAtom);

	const addEntry = useCallback(
		(entry: DownloadActivityEntry) => {
			setEntries((current) => [entry, ...current].slice(0, MAX_ENTRIES));
		},
		[setEntries],
	);

	const updateEntry = useCallback(
		(id: string, patch: Partial<DownloadActivityEntry>) => {
			setEntries((current) =>
				current.map((entry) =>
					entry.id === id ? { ...entry, ...patch } : entry,
				),
			);
		},
		[setEntries],
	);

	const clearFinished = useCallback(() => {
		setEntries((current) =>
			current.filter((entry) => entry.status === "downloading"),
		);
	}, [setEntries]);

	const dismissEntry = useCallback(
		(id: string) => {
			setEntries((current) => current.filter((entry) => entry.id !== id));
		},
		[setEntries],
	);

	return { entries, addEntry, updateEntry, clearFinished, dismissEntry };
}

export function useDownloadActivityEvents() {
	const [, setEntries] = useAtom(downloadActivityAtom);

	useEffect(() => {
		const onProgress = (
			_event: unknown,
			payload?: { id?: string; percent?: number },
		) => {
			if (!payload?.id) return;
			setEntries((current) =>
				current.map((entry) =>
					entry.id === payload.id
						? { ...entry, progress: payload.percent ?? entry.progress }
						: entry,
				),
			);
		};
		const onComplete = (
			_event: unknown,
			payload?: {
				id?: string;
				path?: string;
				filename?: string;
				size?: number;
			},
		) => {
			if (!payload?.id) return;
			setEntries((current) =>
				current.map((entry) =>
					entry.id === payload.id
						? {
								...entry,
								status: "completed",
								progress: 100,
								path: payload.path ?? entry.path,
								filename: payload.filename ?? entry.filename,
								size: payload.size ?? entry.size,
							}
						: entry,
				),
			);
		};
		const onError = (
			_event: unknown,
			payload?: { id?: string; error?: string } | string,
		) => {
			const id = typeof payload === "object" ? payload.id : undefined;
			if (!id) return;
			setEntries((current) =>
				current.map((entry) =>
					entry.id === id
						? {
								...entry,
								status: "failed",
								error:
									typeof payload === "object"
										? payload.error
										: "Download failed",
							}
						: entry,
				),
			);
		};

		window.ipcRenderer.on("download:progress", onProgress);
		window.ipcRenderer.on("download:complete", onComplete);
		window.ipcRenderer.on("download:error", onError);
		return () => {
			window.ipcRenderer.removeListener("download:progress", onProgress);
			window.ipcRenderer.removeListener("download:complete", onComplete);
			window.ipcRenderer.removeListener("download:error", onError);
		};
	}, [setEntries]);
}
