export const themeOptions = ["system", "light", "dark"] as const;
export type ThemeSetting = (typeof themeOptions)[number];

export const languageOptions = ["system", "da", "en"] as const;
export type LanguageSetting = (typeof languageOptions)[number];

export const landingPageOptions = [
	"overview",
	"courses",
	"calendar",
	"tasks",
	"messages",
] as const;
export type LandingPageSetting = (typeof landingPageOptions)[number];

export const courseSortOptions = [
	"LastOnline",
	"LastUpdated",
	"Title",
	"Rank",
] as const;
export type CourseSortSetting = (typeof courseSortOptions)[number];

export const sidebarDensityOptions = ["comfortable", "compact"] as const;
export type SidebarDensitySetting = (typeof sidebarDensityOptions)[number];

export const downloadAutoOpenOptions = ["never", "file", "folder"] as const;
export type DownloadAutoOpenSetting = (typeof downloadAutoOpenOptions)[number];

export const resourceCacheModeOptions = [
	"opened",
	"pdf-only",
	"manual",
] as const;
export type ResourceCacheModeSetting =
	(typeof resourceCacheModeOptions)[number];

export const calendarViewOptions = ["month", "week", "day", "agenda"] as const;
export type CalendarViewSetting = (typeof calendarViewOptions)[number];

export const calendarWeekStartOptions = ["monday", "sunday"] as const;
export type CalendarWeekStartSetting =
	(typeof calendarWeekStartOptions)[number];

// --- Setting definitions -------------------------------------------------------------------------------------------
// One entry per setting: its default and how to validate a stored/incoming value. `SettingsOptions`, `defaultSettings`,
// `validateSetting` and `normalizeSettings` are all derived from `settingDefinitions`, so adding a setting is one line.
// Keys are persisted in electron-store: never rename an existing one.

type Definition<T> = {
	readonly default: T;
	/** Returns the value when valid, otherwise the default. */
	readonly parse: (value: unknown) => T;
};

/** Build a definition from a check that returns the cleaned value, or `undefined` when the input is invalid. */
const define = <T>(
	fallback: T,
	check: (value: unknown) => T | undefined,
): Definition<T> => ({
	default: fallback,
	parse: (value) => check(value) ?? fallback,
});

const oneOf = <const O extends readonly string[]>(
	options: O,
	fallback: O[number],
) =>
	define<O[number]>(fallback, (value) =>
		typeof value === "string" && (options as readonly string[]).includes(value)
			? value
			: undefined,
	);

const flag = (fallback: boolean) =>
	define(fallback, (value) => (typeof value === "boolean" ? value : undefined));

const clampedInt = (fallback: number, min: number, max: number) =>
	define(fallback, (value) =>
		typeof value === "number" && Number.isFinite(value)
			? Math.min(Math.max(Math.round(value), min), max)
			: undefined,
	);

const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;
const timeOfDay = (fallback: string) =>
	define(fallback, (value) =>
		typeof value === "string" && timePattern.test(value) ? value : undefined,
	);

const optionalPath = define<string | null>(null, (value) =>
	typeof value === "string" && value.trim().length > 0 ? value : undefined,
);

const settingDefinitions = {
	theme: oneOf(themeOptions, "system"),
	language: oneOf(languageOptions, "system"),
	defaultLandingPage: oneOf(landingPageOptions, "overview"),
	courseSortBy: oneOf(courseSortOptions, "LastOnline"),
	sidebarDensity: oneOf(sidebarDensityOptions, "comfortable"),
	notificationsMessages: flag(true),
	notificationsTasks: flag(true),
	notificationsAppUpdates: flag(true),
	notificationQuietHoursEnabled: flag(false),
	notificationQuietHoursStart: timeOfDay("22:00"),
	notificationQuietHoursEnd: timeOfDay("07:00"),
	downloadDirectory: optionalPath,
	downloadAutoOpen: oneOf(downloadAutoOpenOptions, "never"),
	resourceCacheMaxSizeMb: clampedInt(512, 50, 10_240),
	resourceCacheMode: oneOf(resourceCacheModeOptions, "opened"),
	calendarDefaultView: oneOf(calendarViewOptions, "agenda"),
	calendarWeekStartsOn: oneOf(calendarWeekStartOptions, "monday"),
	calendarShowWeekends: flag(true),
	CustomPDFrenderer: flag(true),
	CustomTitleBar: flag(true),
	CustomTitleBarButtons: flag(true),
	UploadAIChats: flag(false),
	pdfAIChatSidepanelOpenByDefault: flag(false),
	DefaultAIChatSidepanel: flag(false),
	CustomPDFSidebarOpened: flag(true),
	updatesAutoCheckOnStartup: flag(true),
	authRefreshIntervalMinutes: clampedInt(45, 5, 240),
} as const;

type Definitions = typeof settingDefinitions;

export type SettingsOptions = {
	-readonly [K in keyof Definitions]: Definitions[K]["default"];
};

export type SettingsKey = keyof SettingsOptions;

export const settingKeys = Object.keys(settingDefinitions) as SettingsKey[];

export const defaultSettings = Object.fromEntries(
	settingKeys.map((key) => [key, settingDefinitions[key].default]),
) as SettingsOptions;

export function validateSetting<K extends SettingsKey>(
	key: K,
	value: unknown,
): SettingsOptions[K] {
	return settingDefinitions[key].parse(value) as SettingsOptions[K];
}

/** Every known key, validated; unknown keys are dropped and missing/invalid ones fall back to their default. */
export function normalizeSettings(
	input: Partial<Record<SettingsKey, unknown>> = {},
): SettingsOptions {
	const result = { ...defaultSettings };
	for (const key of settingKeys) {
		(result as Record<SettingsKey, unknown>)[key] = validateSetting(
			key,
			input[key],
		);
	}
	return result;
}

export function isQuietHoursActive(
	settings: SettingsOptions,
	date = new Date(),
) {
	if (!settings.notificationQuietHoursEnabled) return false;

	const [startHour, startMinute] = settings.notificationQuietHoursStart
		.split(":")
		.map(Number);
	const [endHour, endMinute] = settings.notificationQuietHoursEnd
		.split(":")
		.map(Number);

	const currentMinutes = date.getHours() * 60 + date.getMinutes();
	const startMinutes = startHour * 60 + startMinute;
	const endMinutes = endHour * 60 + endMinute;

	if (startMinutes === endMinutes) return true;
	if (startMinutes < endMinutes) {
		return currentMinutes >= startMinutes && currentMinutes < endMinutes;
	}

	return currentMinutes >= startMinutes || currentMinutes < endMinutes;
}
