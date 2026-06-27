import {
	type DownloadActivityEntry,
	downloadActivityAtom,
} from "@/atoms/download-activity";
import { useAtom } from "jotai";
import { useCallback } from "react";

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

	return { entries, addEntry, updateEntry, clearFinished };
}
