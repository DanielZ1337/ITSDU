import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "notification-center:seen-ids";
const MAX_TRACKED_IDS = 200;

function readSeenIds(): Set<string> {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return new Set();
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? new Set(parsed) : new Set();
	} catch (error) {
		console.error("Failed to read notification center state:", error);
		return new Set();
	}
}

function writeSeenIds(ids: Set<string>) {
	try {
		const trimmed = Array.from(ids).slice(-MAX_TRACKED_IDS);
		localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
	} catch (error) {
		console.error("Failed to persist notification center state:", error);
	}
}

export function useNotificationCenter() {
	const [seenIds, setSeenIds] = useState<Set<string>>(() => readSeenIds());

	useEffect(() => {
		writeSeenIds(seenIds);
	}, [seenIds]);

	const markSeen = useCallback((ids: string[]) => {
		if (ids.length === 0) return;
		setSeenIds((current) => {
			const next = new Set(current);
			for (const id of ids) next.add(id);
			return next;
		});
	}, []);

	return { seenIds, markSeen };
}
