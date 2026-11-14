import type { DownloadActivityEntry } from "@/atoms/download-activity";

export const DOWNLOAD_HISTORY_KEY = "itsdu:download-history:v1";
export const DOWNLOAD_HISTORY_LIMIT = 100;

export function readDownloadHistory(
	raw: string | null,
): DownloadActivityEntry[] {
	try {
		const value: unknown = JSON.parse(raw ?? "[]");
		if (!Array.isArray(value)) return [];
		return value
			.filter(
				(entry) =>
					entry &&
					typeof entry.id === "string" &&
					typeof entry.filename === "string" &&
					(entry.status === "completed" || entry.status === "failed") &&
					Number.isFinite(Date.parse(entry.startedAt)),
			)
			.slice(0, DOWNLOAD_HISTORY_LIMIT)
			.map((entry) => ({ ...entry, startedAt: new Date(entry.startedAt) }));
	} catch {
		return [];
	}
}

export function serializeDownloadHistory(
	entries: DownloadActivityEntry[],
): string {
	return JSON.stringify(
		entries
			.filter((entry) => entry.status !== "downloading")
			.slice(0, DOWNLOAD_HISTORY_LIMIT),
	);
}
