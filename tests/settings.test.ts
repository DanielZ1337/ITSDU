import { describe, expect, it } from "vitest";
import { defaultSettings, normalizeSettings, validateSetting } from "@/types/settings";

describe("settings", () => {
	it("fills every missing key with its default", () => {
		expect(normalizeSettings({})).toEqual(defaultSettings);
	});
	it("keeps valid stored values and repairs invalid ones", () => {
		const out = normalizeSettings({ theme: "dark", courseSortBy: "nonsense" as never });
		expect(out.theme).toBe("dark");
		expect(out.courseSortBy).toBe(defaultSettings.courseSortBy);
	});
	it("validateSetting falls back to the default for bad values", () => {
		expect(validateSetting("theme", "purple" as never)).toBe(defaultSettings.theme);
		expect(validateSetting("theme", "light")).toBe("light");
	});
});
