import { readFileSync } from "node:fs";
import path from "node:path";
import JSON5 from "json5";
import { describe, expect, it } from "vitest";

const root = path.resolve(import.meta.dirname, "..");
const config = JSON5.parse(
	readFileSync(path.join(root, "electron-builder.json5"), "utf8"),
);
const packageJson = JSON.parse(
	readFileSync(path.join(root, "package.json"), "utf8"),
);

// Regression test for two related breakages hit in the same release:
// 1. electron-builder rejected `linux.desktopName` outright ("configuration.linux should be
//    one of these") — desktopName has to live in package.json, not this config.
// 2. Without package.json's desktopName set, electron-builder just warns at build time
//    ("desktopName is not set in package.json") and Linux desktop environments can't
//    associate running windows with the .desktop entry (no window icon/grouping in the dock).
describe("electron-builder Linux window association config", () => {
	it("does not set desktopName in electron-builder.json5 (invalid there; electron-builder reads it from package.json)", () => {
		expect(config.linux).not.toHaveProperty("desktopName");
	});

	it("turns on syncDesktopName so the .desktop filename/WM_CLASS follow package.json's desktopName", () => {
		expect(config.linux.syncDesktopName).toBe(true);
	});

	it('sets package.json\'s desktopName to match the runtime WM_CLASS (app.getName(), i.e. "name")', () => {
		expect(packageJson.desktopName).toBe(`${packageJson.name}.desktop`);
	});

	it("validates against electron-builder's own configuration schema", async () => {
		const { validateConfiguration } = await import(
			"app-builder-lib/out/util/config/config.js"
		);
		const { DebugLogger } = await import("builder-util");
		await expect(
			validateConfiguration(config, new DebugLogger(false)),
		).resolves.not.toThrow();
	});
});
