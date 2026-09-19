import { describe, expect, it } from "vitest";
import {
	defaultSettings,
	normalizeSettings,
	validateSetting,
} from "@/types/settings";

describe("settings", () => {
	it("fills every missing key with its default", () => {
		expect(normalizeSettings({})).toEqual(defaultSettings);
	});
	it("keeps valid stored values and repairs invalid ones", () => {
		const out = normalizeSettings({
			theme: "dark",
			courseSortBy: "nonsense" as never,
		});
		expect(out.theme).toBe("dark");
		expect(out.courseSortBy).toBe(defaultSettings.courseSortBy);
	});
	it("validateSetting falls back to the default for bad values", () => {
		expect(validateSetting("theme", "purple" as never)).toBe(
			defaultSettings.theme,
		);
		expect(validateSetting("theme", "light")).toBe("light");
	});
});

describe("settings validation rules", () => {
	it("clamps numbers and rounds them", () => {
		expect(validateSetting("resourceCacheMaxSizeMb", 5)).toBe(50);
		expect(validateSetting("resourceCacheMaxSizeMb", 99_999)).toBe(10_240);
		expect(validateSetting("authRefreshIntervalMinutes", 12.6)).toBe(13);
		expect(validateSetting("authRefreshIntervalMinutes", Number.NaN)).toBe(
			defaultSettings.authRefreshIntervalMinutes,
		);
	});
	it("accepts only HH:mm times", () => {
		expect(validateSetting("notificationQuietHoursStart", "23:30")).toBe(
			"23:30",
		);
		expect(validateSetting("notificationQuietHoursStart", "24:00")).toBe(
			defaultSettings.notificationQuietHoursStart,
		);
	});
	it("treats blank download directories as unset and keeps real ones", () => {
		expect(validateSetting("downloadDirectory", "   ")).toBeNull();
		expect(validateSetting("downloadDirectory", "C:\\Downloads")).toBe(
			"C:\\Downloads",
		);
	});
	it("ignores wrong types for booleans and drops unknown keys", () => {
		expect(validateSetting("UploadAIChats", "yes")).toBe(false);
		expect(validateSetting("calendarShowWeekends", false)).toBe(false);
		expect(Object.keys(normalizeSettings({ nope: 1 } as never))).toEqual(
			Object.keys(defaultSettings),
		);
	});
});
