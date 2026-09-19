import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { getAppIconPath } from "../electron/utils/icon";

const originalPlatform = process.platform;
const originalVitePublic = process.env.VITE_PUBLIC;

function setPlatform(platform: NodeJS.Platform) {
	Object.defineProperty(process, "platform", { value: platform });
}

describe("getAppIconPath", () => {
	afterEach(() => {
		setPlatform(originalPlatform);
		process.env.VITE_PUBLIC = originalVitePublic;
	});

	it("uses the PNG on Linux (nativeImage's .ico decoder can fail on multi-resolution ICOs there)", () => {
		setPlatform("linux");
		process.env.VITE_PUBLIC = "/app/public";
		expect(getAppIconPath()).toBe(
			path.join("/app/public", "i_logo_colored.png"),
		);
	});

	it.each(["win32", "darwin"] as const)("uses the .ico on %s", (platform) => {
		setPlatform(platform);
		process.env.VITE_PUBLIC = "/app/public";
		expect(getAppIconPath()).toBe(path.join("/app/public", "icon.ico"));
	});
});
