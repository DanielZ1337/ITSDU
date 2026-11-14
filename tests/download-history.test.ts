import { describe, expect, it } from "vitest";
import { readDownloadHistory, serializeDownloadHistory } from "@/lib/download-history";

describe("local download history", () => {
	it("retains finished downloads and restores their timestamps", () => {
		const date = new Date("2026-11-14T00:00:00Z");
		const data = serializeDownloadHistory([
			{ id: "1", filename: "a.pdf", startedAt: date, status: "completed", path: "local/a.pdf" },
			{ id: "2", filename: "b.pdf", startedAt: date, status: "downloading" },
		]);
		const restored = readDownloadHistory(data);
		expect(restored).toHaveLength(1);
		expect(restored[0].startedAt).toEqual(date);
	});
	it("ignores malformed and interrupted entries", () => {
		expect(readDownloadHistory("not json")).toEqual([]);
		expect(readDownloadHistory('[{"id":"1","filename":"x","startedAt":"nope","status":"failed"}]')).toEqual([]);
	});
});
