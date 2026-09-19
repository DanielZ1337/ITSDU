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
// Settings are grouped by area (`notifications.messages`, `calendar.weekStartsOn`). Each setting is declared once with
// its default and validation; `SettingsOptions`, `SettingsPath`, `defaultSettings`, `validateSetting` and
// `normalizeSettings` are all derived from `settingSchema`. Stored keys are persisted: never rename one without a
// migration (`legacyKeyToPath` maps the old flat keys for the one-time migration).

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

const settingSchema = {
	appearance: {
		theme: oneOf(themeOptions, "system"),
		language: oneOf(languageOptions, "system"),
		sidebarDensity: oneOf(sidebarDensityOptions, "comfortable"),
		customTitleBar: flag(true),
		customTitleBarButtons: flag(true),
	},
	navigation: {
		defaultLandingPage: oneOf(landingPageOptions, "overview"),
		courseSortBy: oneOf(courseSortOptions, "LastOnline"),
	},
	notifications: {
		messages: flag(true),
		tasks: flag(true),
		appUpdates: flag(true),
		quietHoursEnabled: flag(false),
		quietHoursStart: timeOfDay("22:00"),
		quietHoursEnd: timeOfDay("07:00"),
	},
	downloads: {
		directory: optionalPath,
		autoOpen: oneOf(downloadAutoOpenOptions, "never"),
	},
	cache: {
		maxSizeMb: clampedInt(512, 50, 10_240),
		mode: oneOf(resourceCacheModeOptions, "opened"),
	},
	calendar: {
		defaultView: oneOf(calendarViewOptions, "agenda"),
		weekStartsOn: oneOf(calendarWeekStartOptions, "monday"),
		showWeekends: flag(true),
	},
	pdf: {
		customRenderer: flag(true),
		sidebarOpened: flag(true),
		aiChatSidepanelOpenByDefault: flag(false),
	},
	ai: {
		uploadChats: flag(false),
		defaultChatSidepanel: flag(false),
	},
	updates: {
		autoCheckOnStartup: flag(true),
	},
	auth: {
		refreshIntervalMinutes: clampedInt(45, 5, 240),
	},
} as const;

type Schema = typeof settingSchema;

export type SettingsGroup = keyof Schema;

export type SettingsOptions = {
	-readonly [G in SettingsGroup]: {
		-readonly [K in keyof Schema[G]]: Schema[G][K] extends Definition<infer T>
			? T
			: never;
	};
};

/** "group.key", for example "notifications.messages". */
export type SettingsPath = {
	[G in SettingsGroup]: `${G}.${Extract<keyof Schema[G], string>}`;
}[SettingsGroup];

export type SettingValue<P extends SettingsPath> =
	P extends `${infer G}.${infer K}`
		? G extends SettingsGroup
			? K extends keyof SettingsOptions[G]
				? SettingsOptions[G][K]
				: never
			: never
		: never;

/** A set of changes keyed by path; each value is checked against its setting. */
export type SettingsChanges = { [P in SettingsPath]?: SettingValue<P> };

export const settingGroups = Object.keys(settingSchema) as SettingsGroup[];

export const settingPaths = settingGroups.flatMap((group) =>
	Object.keys(settingSchema[group]).map((key) => `${group}.${key}`),
) as SettingsPath[];

const splitPath = (path: SettingsPath) => {
	const [group, key] = path.split(".") as [SettingsGroup, string];
	return { group, key };
};

const definitionFor = (path: SettingsPath): Definition<unknown> => {
	const { group, key } = splitPath(path);
	return (settingSchema[group] as Record<string, Definition<unknown>>)[key];
};

export const defaultSettings = Object.fromEntries(
	settingGroups.map((group) => [
		group,
		Object.fromEntries(
			Object.entries(settingSchema[group]).map(([key, def]) => [
				key,
				(def as Definition<unknown>).default,
			]),
		),
	]),
) as SettingsOptions;

export const isSettingsPath = (value: unknown): value is SettingsPath =>
	typeof value === "string" && (settingPaths as string[]).includes(value);

export function getSetting<P extends SettingsPath>(
	settings: SettingsOptions,
	path: P,
): SettingValue<P> {
	const { group, key } = splitPath(path);
	return (settings[group] as Record<string, unknown>)[key] as SettingValue<P>;
}

/** Returns a copy of `settings` with one value replaced (no validation). */
export function withSetting<P extends SettingsPath>(
	settings: SettingsOptions,
	path: P,
	value: SettingValue<P>,
): SettingsOptions {
	const { group, key } = splitPath(path);
	return { ...settings, [group]: { ...settings[group], [key]: value } };
}

export function validateSetting<P extends SettingsPath>(
	path: P,
	value: unknown,
): SettingValue<P> {
	return definitionFor(path).parse(value) as SettingValue<P>;
}

/**
 * The flat keys used before settings were grouped. Only the one-time migration reads them:
 * electron-store data, the renderer's old localStorage copy and imported values.
 */
export const legacyKeyToPath = {
	theme: "appearance.theme",
	language: "appearance.language",
	sidebarDensity: "appearance.sidebarDensity",
	CustomTitleBar: "appearance.customTitleBar",
	CustomTitleBarButtons: "appearance.customTitleBarButtons",
	defaultLandingPage: "navigation.defaultLandingPage",
	courseSortBy: "navigation.courseSortBy",
	notificationsMessages: "notifications.messages",
	notificationsTasks: "notifications.tasks",
	notificationsAppUpdates: "notifications.appUpdates",
	notificationQuietHoursEnabled: "notifications.quietHoursEnabled",
	notificationQuietHoursStart: "notifications.quietHoursStart",
	notificationQuietHoursEnd: "notifications.quietHoursEnd",
	downloadDirectory: "downloads.directory",
	downloadAutoOpen: "downloads.autoOpen",
	resourceCacheMaxSizeMb: "cache.maxSizeMb",
	resourceCacheMode: "cache.mode",
	calendarDefaultView: "calendar.defaultView",
	calendarWeekStartsOn: "calendar.weekStartsOn",
	calendarShowWeekends: "calendar.showWeekends",
	CustomPDFrenderer: "pdf.customRenderer",
	CustomPDFSidebarOpened: "pdf.sidebarOpened",
	pdfAIChatSidepanelOpenByDefault: "pdf.aiChatSidepanelOpenByDefault",
	UploadAIChats: "ai.uploadChats",
	DefaultAIChatSidepanel: "ai.defaultChatSidepanel",
	updatesAutoCheckOnStartup: "updates.autoCheckOnStartup",
	authRefreshIntervalMinutes: "auth.refreshIntervalMinutes",
} as const satisfies Record<string, SettingsPath>;

export type LegacySettingsKey = keyof typeof legacyKeyToPath;

export const legacySettingKeys = Object.keys(
	legacyKeyToPath,
) as LegacySettingsKey[];

/** True when the object still uses the old flat shape (any legacy key at the top level). */
export const hasLegacySettingKeys = (input: unknown): boolean =>
	typeof input === "object" &&
	input !== null &&
	legacySettingKeys.some((key) => key in input);

const pathToLegacyKey = Object.fromEntries(
	Object.entries(legacyKeyToPath).map(([legacy, path]) => [path, legacy]),
) as Record<SettingsPath, LegacySettingsKey>;

/**
 * Every setting, validated. Accepts the grouped shape, the old flat shape, or a mix (a grouped value wins); unknown
 * keys are dropped and missing/invalid values fall back to their default.
 */
export function normalizeSettings(input: unknown = {}): SettingsOptions {
	const source = (
		typeof input === "object" && input !== null ? input : {}
	) as Record<string, unknown>;
	const result = structuredClone(defaultSettings);
	for (const path of settingPaths) {
		const { group, key } = splitPath(path);
		const grouped = (source[group] as Record<string, unknown> | undefined)?.[
			key
		];
		const raw = grouped !== undefined ? grouped : source[pathToLegacyKey[path]];
		(result[group] as Record<string, unknown>)[key] = validateSetting(
			path,
			raw,
		);
	}
	return result;
}

export function isQuietHoursActive(
	settings: SettingsOptions,
	date = new Date(),
) {
	if (!settings.notifications.quietHoursEnabled) return false;

	const [startHour, startMinute] = settings.notifications.quietHoursStart
		.split(":")
		.map(Number);
	const [endHour, endMinute] = settings.notifications.quietHoursEnd
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
