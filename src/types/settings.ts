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

export const calendarViewOptions = ["month", "week", "day", "agenda"] as const;
export type CalendarViewSetting = (typeof calendarViewOptions)[number];

export const calendarWeekStartOptions = ["monday", "sunday"] as const;
export type CalendarWeekStartSetting =
	(typeof calendarWeekStartOptions)[number];

export type SettingsOptions = {
	theme: ThemeSetting;
	language: LanguageSetting;
	defaultLandingPage: LandingPageSetting;
	courseSortBy: CourseSortSetting;
	sidebarDensity: SidebarDensitySetting;
	notificationsMessages: boolean;
	notificationsTasks: boolean;
	notificationsAppUpdates: boolean;
	notificationQuietHoursEnabled: boolean;
	notificationQuietHoursStart: string;
	notificationQuietHoursEnd: string;
	downloadDirectory: string | null;
	downloadAutoOpen: DownloadAutoOpenSetting;
	calendarDefaultView: CalendarViewSetting;
	calendarWeekStartsOn: CalendarWeekStartSetting;
	calendarShowWeekends: boolean;
	CustomPDFrenderer: boolean;
	CustomTitleBar: boolean;
	CustomTitleBarButtons: boolean;
	UploadAIChats: boolean;
	pdfAIChatSidepanelOpenByDefault: boolean;
	DefaultAIChatSidepanel: boolean;
	CustomPDFSidebarOpened: boolean;
	updatesAutoCheckOnStartup: boolean;
};

export type SettingsKey = keyof SettingsOptions;

export const defaultSettings: SettingsOptions = {
	theme: "system",
	language: "system",
	defaultLandingPage: "overview",
	courseSortBy: "LastOnline",
	sidebarDensity: "comfortable",
	notificationsMessages: true,
	notificationsTasks: true,
	notificationsAppUpdates: true,
	notificationQuietHoursEnabled: false,
	notificationQuietHoursStart: "22:00",
	notificationQuietHoursEnd: "07:00",
	downloadDirectory: null,
	downloadAutoOpen: "never",
	calendarDefaultView: "agenda",
	calendarWeekStartsOn: "monday",
	calendarShowWeekends: true,
	CustomPDFrenderer: true,
	CustomTitleBar: true,
	CustomTitleBarButtons: true,
	UploadAIChats: false,
	pdfAIChatSidepanelOpenByDefault: false,
	DefaultAIChatSidepanel: false,
	CustomPDFSidebarOpened: true,
	updatesAutoCheckOnStartup: true,
};

const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

const isOption = <T extends readonly string[]>(
	options: T,
	value: unknown,
): value is T[number] => typeof value === "string" && options.includes(value);

export function validateSetting<K extends SettingsKey>(
	key: K,
	value: unknown,
): SettingsOptions[K] {
	const fallback = defaultSettings[key];

	switch (key) {
		case "theme":
			return (
				isOption(themeOptions, value) ? value : fallback
			) as SettingsOptions[K];
		case "language":
			return (
				isOption(languageOptions, value) ? value : fallback
			) as SettingsOptions[K];
		case "defaultLandingPage":
			return (
				isOption(landingPageOptions, value) ? value : fallback
			) as SettingsOptions[K];
		case "courseSortBy":
			return (
				isOption(courseSortOptions, value) ? value : fallback
			) as SettingsOptions[K];
		case "sidebarDensity":
			return (
				isOption(sidebarDensityOptions, value) ? value : fallback
			) as SettingsOptions[K];
		case "downloadAutoOpen":
			return (
				isOption(downloadAutoOpenOptions, value) ? value : fallback
			) as SettingsOptions[K];
		case "calendarDefaultView":
			return (
				isOption(calendarViewOptions, value) ? value : fallback
			) as SettingsOptions[K];
		case "calendarWeekStartsOn":
			return (
				isOption(calendarWeekStartOptions, value) ? value : fallback
			) as SettingsOptions[K];
		case "downloadDirectory":
			return (
				typeof value === "string" && value.trim().length > 0 ? value : null
			) as SettingsOptions[K];
		case "notificationQuietHoursStart":
		case "notificationQuietHoursEnd":
			return (
				typeof value === "string" && timePattern.test(value) ? value : fallback
			) as SettingsOptions[K];
		default:
			return (
				typeof fallback === "boolean" && typeof value === "boolean"
					? value
					: fallback
			) as SettingsOptions[K];
	}
}

export function normalizeSettings(
	input: Partial<Record<SettingsKey, unknown>> = {},
): SettingsOptions {
	return Object.keys(defaultSettings).reduce(
		(acc, key) => {
			const settingKey = key as SettingsKey;
			acc[settingKey] = validateSetting(settingKey, input[settingKey]) as never;
			return acc;
		},
		{ ...defaultSettings },
	);
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
