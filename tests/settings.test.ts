import { describe, expect, it } from "vitest";
import {
	defaultSettings,
	getSetting,
	hasLegacySettingKeys,
	isSettingsPath,
	legacyKeyToPath,
	legacySettingKeys,
	normalizeSettings,
	settingPaths,
	validateSetting,
	withSetting,
} from "@/types/settings";

describe("grouped settings", () => {
	it("fills every missing setting with its default", () => {
		expect(normalizeSettings({})).toEqual(defaultSettings);
		expect(normalizeSettings(undefined)).toEqual(defaultSettings);
		expect(normalizeSettings("nonsense")).toEqual(defaultSettings);
	});
	it("keeps valid grouped values and repairs invalid ones", () => {
		const out = normalizeSettings({
			appearance: { theme: "dark" },
			navigation: { courseSortBy: "nonsense" },
		});
		expect(out.appearance.theme).toBe("dark");
		expect(out.navigation.courseSortBy).toBe(
			defaultSettings.navigation.courseSortBy,
		);
	});
	it("exposes every setting as a dotted path", () => {
		expect(settingPaths).toContain("notifications.messages");
		expect(settingPaths).toContain("calendar.weekStartsOn");
		expect(isSettingsPath("notifications.messages")).toBe(true);
		expect(isSettingsPath("notificationsMessages")).toBe(false);
		expect(isSettingsPath("__proto__.x")).toBe(false);
	});
	it("reads and replaces single values by path", () => {
		expect(getSetting(defaultSettings, "cache.maxSizeMb")).toBe(512);
		const next = withSetting(defaultSettings, "cache.maxSizeMb", 100);
		expect(next.cache.maxSizeMb).toBe(100);
		expect(defaultSettings.cache.maxSizeMb).toBe(512);
	});
	it("does not share state with the defaults", () => {
		const a = normalizeSettings({});
		a.appearance.theme = "dark";
		expect(normalizeSettings({}).appearance.theme).toBe("system");
	});
});

describe("legacy flat settings", () => {
	it("maps every legacy key to a real path, one to one", () => {
		const targets = Object.values(legacyKeyToPath);
		expect(new Set(targets).size).toBe(targets.length);
		expect([...targets].sort()).toEqual([...settingPaths].sort());
	});
	it("recognises the old flat shape", () => {
		expect(hasLegacySettingKeys({ theme: "dark" })).toBe(true);
		expect(hasLegacySettingKeys({ appearance: { theme: "dark" } })).toBe(false);
		expect(hasLegacySettingKeys(null)).toBe(false);
		expect(legacySettingKeys.length).toBe(settingPaths.length);
	});
	it("migrates a full flat store into groups without losing values", () => {
		const flat = {
			theme: "dark",
			language: "da",
			sidebarDensity: "compact",
			CustomTitleBar: false,
			CustomTitleBarButtons: false,
			defaultLandingPage: "courses",
			courseSortBy: "Title",
			notificationsMessages: false,
			notificationsTasks: false,
			notificationsAppUpdates: false,
			notificationQuietHoursEnabled: true,
			notificationQuietHoursStart: "21:15",
			notificationQuietHoursEnd: "06:45",
			downloadDirectory: "C:\\Users\\me\\Downloads",
			downloadAutoOpen: "folder",
			resourceCacheMaxSizeMb: 2048,
			resourceCacheMode: "pdf-only",
			calendarDefaultView: "month",
			calendarWeekStartsOn: "sunday",
			calendarShowWeekends: false,
			CustomPDFrenderer: false,
			CustomPDFSidebarOpened: false,
			pdfAIChatSidepanelOpenByDefault: true,
			UploadAIChats: true,
			DefaultAIChatSidepanel: true,
			updatesAutoCheckOnStartup: false,
			authRefreshIntervalMinutes: 30,
		};
		const out = normalizeSettings(flat);
		for (const [legacy, path] of Object.entries(legacyKeyToPath)) {
			expect(getSetting(out, path), `${legacy} -> ${path}`).toEqual(
				flat[legacy as keyof typeof flat],
			);
		}
	});
	it("lets a grouped value win over a leftover flat key", () => {
		const out = normalizeSettings({
			theme: "dark",
			appearance: { theme: "light" },
		});
		expect(out.appearance.theme).toBe("light");
	});
});

describe("settings validation rules", () => {
	it("falls back to the default for bad enum values", () => {
		expect(validateSetting("appearance.theme", "purple")).toBe(
			defaultSettings.appearance.theme,
		);
		expect(validateSetting("appearance.theme", "light")).toBe("light");
	});
	it("clamps numbers and rounds them", () => {
		expect(validateSetting("cache.maxSizeMb", 5)).toBe(50);
		expect(validateSetting("cache.maxSizeMb", 99_999)).toBe(10_240);
		expect(validateSetting("auth.refreshIntervalMinutes", 12.6)).toBe(13);
		expect(validateSetting("auth.refreshIntervalMinutes", Number.NaN)).toBe(
			defaultSettings.auth.refreshIntervalMinutes,
		);
	});
	it("accepts only HH:mm times", () => {
		expect(validateSetting("notifications.quietHoursStart", "23:30")).toBe(
			"23:30",
		);
		expect(validateSetting("notifications.quietHoursStart", "24:00")).toBe(
			defaultSettings.notifications.quietHoursStart,
		);
	});
	it("treats blank download directories as unset and keeps real ones", () => {
		expect(validateSetting("downloads.directory", "   ")).toBeNull();
		expect(validateSetting("downloads.directory", "C:\\Downloads")).toBe(
			"C:\\Downloads",
		);
	});
	it("ignores wrong types for booleans and drops unknown keys", () => {
		expect(validateSetting("ai.uploadChats", "yes")).toBe(false);
		expect(validateSetting("calendar.showWeekends", false)).toBe(false);
		const out = normalizeSettings({ nope: 1, appearance: { nope: 2 } });
		expect(out).toEqual(defaultSettings);
	});
});
