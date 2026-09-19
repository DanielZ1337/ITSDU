import { cpSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// Fixtures were written by electron-store 8.2.0 (tests/fixtures/make-electron-store-v8-fixture.cjs).
// This gate must stay green across the electron-store upgrade: users' persisted tokens/settings must still open.
function copyFixture() {
	const dir = mkdtempSync(join(tmpdir(), "itsdu-store-"));
	cpSync(join(import.meta.dirname, "fixtures", "electron-store-v8"), dir, { recursive: true });
	return dir;
}

describe("electron-store persisted data compatibility", () => {
	it("still decrypts the auth store written by v8", async () => {
		const { default: Store } = await import("electron-store");
		const store = new Store({ cwd: copyFixture(), name: "auth-store", encryptionKey: "fixture-encryption-key" });
		expect(store.get("refresh_token")).toBe("REFRESH-TOKEN-123");
		expect(store.get("access_token")).toBe("ACCESS-éÿ-OK");
	});
	it("still reads the plain settings store written by v8", async () => {
		const { default: Store } = await import("electron-store");
		const store = new Store({ cwd: copyFixture(), name: "settings", defaults: { theme: "light" } });
		expect(store.get("authRefreshIntervalMinutes")).toBe(30);
		expect(store.get("theme")).toBe("dark");
	});
});
