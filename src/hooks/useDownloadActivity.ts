import { useAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";
import {
	type DownloadActivityEntry,
	downloadActivityAtom,
} from "@/atoms/download-activity";
import { useSettings } from "@/hooks/atoms/useSettings";
import {
	DOWNLOAD_HISTORY_KEY,
	DOWNLOAD_HISTORY_LIMIT,
	readDownloadHistory,
	serializeDownloadHistory,
} from "@/lib/download-history";

const MAX_ENTRIES = DOWNLOAD_HISTORY_LIMIT;

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
	const [entries, setEntries] = useAtom(downloadActivityAtom);
	const { settings, isHydrated } = useSettings();
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		if (!isHydrated) return;
		if (!settings.privacy.saveDownloadHistory) {
			try {
				localStorage.removeItem(DOWNLOAD_HISTORY_KEY);
			} catch {
				/* Storage is optional. */
			}
			setLoaded(false);
			return;
		}
		if (loaded) return;
		try {
			const saved = readDownloadHistory(
				localStorage.getItem(DOWNLOAD_HISTORY_KEY),
			);
			setEntries((current) =>
				[
					...current,
					...saved.filter(
						(entry) => !current.some((item) => item.id === entry.id),
					),
				].slice(0, MAX_ENTRIES),
			);
		} catch {
			/* Storage is optional. */
		}
		setLoaded(true);
	}, [isHydrated, settings.privacy.saveDownloadHistory, setEntries, loaded]);

	useEffect(() => {
		if (!isHydrated || !settings.privacy.saveDownloadHistory || !loaded) return;
		try {
			localStorage.setItem(
				DOWNLOAD_HISTORY_KEY,
				serializeDownloadHistory(entries),
			);
		} catch {
			/* Storage may be full or unavailable; downloads continue normally. */
		}
	}, [entries, isHydrated, settings.privacy.saveDownloadHistory, loaded]);

	useEffect(() => {
		const onProgress = (payload?: { id?: string; percent?: number }) => {
			if (!payload?.id) return;
			setEntries((current) =>
				current.map((entry) =>
					entry.id === payload.id
						? { ...entry, progress: payload.percent ?? entry.progress }
						: entry,
				),
			);
		};
		const onComplete = (payload?: {
			id?: string;
			path?: string;
			filename?: string;
			size?: number;
		}) => {
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
		const onError = (payload?: { id?: string; error?: string } | string) => {
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

		const offs = [
			window.events.on("download:progress", onProgress),
			window.events.on("download:complete", onComplete),
			window.events.on("download:error", onError),
		];
		return () => {
			for (const off of offs) off();
		};
	}, [setEntries]);
}
