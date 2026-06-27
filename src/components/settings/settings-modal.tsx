import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useSettings } from "@/hooks/atoms/useSettings";
import { useShowSettingsModal } from "@/hooks/atoms/useSettingsModal.ts";
import { useVersion } from "@/hooks/atoms/useVersion";
import {
	type TranslationKey,
	formatFileSize,
	useLocale,
	useT,
} from "@/lib/i18n";
import { ItsduResourcesDBWrapper } from "@/lib/resource-indexeddb/resourceIndexedDB";
import { getUpdateErrorMessage } from "@/lib/updates/format-update-error";
import {
	type CalendarViewSetting,
	type CalendarWeekStartSetting,
	type DownloadAutoOpenSetting,
	type LandingPageSetting,
	type LanguageSetting,
	type ResourceCacheModeSetting,
	type SettingsKey,
	type SettingsOptions,
	type SidebarDensitySetting,
	type ThemeSetting,
	downloadAutoOpenOptions,
	resourceCacheModeOptions,
} from "@/types/settings";
import type { UpdateInfo } from "electron-updater";
import {
	Bell,
	BookOpen,
	Brush,
	CalendarDays,
	Database,
	Download,
	FileText,
	Globe2,
	Info,
	LayoutDashboard,
	Lock,
	RefreshCcw,
	Settings2,
	Trash2,
	X,
} from "lucide-react";
import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast as sonnerToast } from "sonner";

type UpdateStatus =
	| "idle"
	| "checking"
	| "current"
	| "available"
	| "downloading"
	| "downloaded"
	| "installing"
	| "error";

type DownloadProgress = {
	percent?: number;
	transferred?: number;
	total?: number;
};

export const sectionIds = [
	"appearance",
	"language",
	"navigation",
	"calendar",
	"notifications",
	"downloads",
	"cache",
	"pdf",
	"appUpdates",
	"privacy",
	"advanced",
] as const;

export type SectionId = (typeof sectionIds)[number];

function isSectionId(value: string | null): value is SectionId {
	return (sectionIds as readonly string[]).includes(value ?? "");
}

export const sectionMeta: Record<
	SectionId,
	{
		labelKey: TranslationKey;
		icon: React.ReactNode;
		descriptionKey: TranslationKey;
	}
> = {
	appearance: {
		labelKey: "settings.group.appearance",
		icon: <Brush className="h-4 w-4" />,
		descriptionKey: "settings.appearance.theme.description",
	},
	language: {
		labelKey: "settings.group.language",
		icon: <Globe2 className="h-4 w-4" />,
		descriptionKey: "settings.language.description",
	},
	navigation: {
		labelKey: "settings.group.navigation",
		icon: <LayoutDashboard className="h-4 w-4" />,
		descriptionKey: "settings.navigation.defaultLanding.description",
	},
	calendar: {
		labelKey: "settings.group.calendar",
		icon: <CalendarDays className="h-4 w-4" />,
		descriptionKey: "settings.calendar.defaultView.description",
	},
	notifications: {
		labelKey: "settings.group.notifications",
		icon: <Bell className="h-4 w-4" />,
		descriptionKey: "settings.notifications.permission.description",
	},
	downloads: {
		labelKey: "settings.group.downloads",
		icon: <Download className="h-4 w-4" />,
		descriptionKey: "settings.downloads.folder.description",
	},
	cache: {
		labelKey: "settings.group.cache",
		icon: <Database className="h-4 w-4" />,
		descriptionKey: "settings.cache.usage.description",
	},
	pdf: {
		labelKey: "settings.group.pdf",
		icon: <FileText className="h-4 w-4" />,
		descriptionKey: "settings.pdf.useViewer.description",
	},
	appUpdates: {
		labelKey: "settings.group.appUpdates",
		icon: <Info className="h-4 w-4" />,
		descriptionKey: "settings.appUpdates.status.description",
	},
	privacy: {
		labelKey: "settings.group.privacy",
		icon: <Lock className="h-4 w-4" />,
		descriptionKey: "settings.privacy.uploadAi.description",
	},
	advanced: {
		labelKey: "settings.group.advanced",
		icon: <Settings2 className="h-4 w-4" />,
		descriptionKey: "settings.advanced.resetAll.description",
	},
};

export default function SettingsModal() {
	const { showSettingsModal, setShowSettingsModal } = useShowSettingsModal();

	return (
		<Dialog open={showSettingsModal} onOpenChange={setShowSettingsModal}>
			<DialogContent
				customClose={<></>}
				className="flex h-[calc(100vh-4rem)] max-h-[860px] w-[calc(100vw-4rem)] max-w-5xl flex-col overflow-hidden rounded-xl border bg-background p-0 gap-0 shadow-2xl focus:outline-none sm:rounded-xl"
			>
				<SettingsScreen />
			</DialogContent>
		</Dialog>
	);
}

function SettingsScreen() {
	const { requestedSection, setRequestedSection } = useShowSettingsModal();
	const t = useT();
	const [activeSection, setActiveSection] = useState<SectionId>(
		isSectionId(requestedSection) ? requestedSection : "appearance",
	);
	const section = sectionMeta[activeSection];

	useEffect(() => {
		if (!isSectionId(requestedSection)) return;
		setActiveSection(requestedSection);
		setRequestedSection(null);
	}, [requestedSection, setRequestedSection]);

	return (
		<div className="flex h-full min-h-0 w-full flex-col">
			{/* Header: doubles as the window drag region while settings is open */}
			<header className="drag flex shrink-0 items-center justify-between gap-4 border-b px-4 py-3 sm:px-6">
				<div className="no-drag flex min-w-0 items-center gap-3">
					<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border bg-card">
						{section.icon}
					</div>
					<div className="min-w-0">
						<h2 className="truncate text-lg font-semibold tracking-tight">
							{t(section.labelKey)}
						</h2>
						<p className="truncate text-sm text-muted-foreground">
							{t(section.descriptionKey)}
						</p>
					</div>
				</div>
				<DialogClose asChild>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="no-drag shrink-0"
					>
						<X className="h-5 w-5" />
						<span className="sr-only">Close settings</span>
					</Button>
				</DialogClose>
			</header>

			{/* Body: fixed sidebar + scrollable content */}
			<div className="flex min-h-0 flex-1">
				<aside className="hidden w-60 shrink-0 flex-col border-r bg-muted/30 md:flex">
					<div className="px-5 pb-1 pt-4">
						<h1 className="text-sm font-semibold text-muted-foreground">
							Settings
						</h1>
					</div>
					<nav className="min-h-0 flex-1 space-y-1 overflow-y-auto p-3">
						{sectionIds.map((sectionId) => (
							<button
								key={sectionId}
								type="button"
								onClick={() => setActiveSection(sectionId)}
								className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground data-[active=true]:bg-accent data-[active=true]:font-medium data-[active=true]:text-foreground"
								data-active={activeSection === sectionId}
							>
								<span className="shrink-0">{sectionMeta[sectionId].icon}</span>
								{t(sectionMeta[sectionId].labelKey)}
							</button>
						))}
					</nav>
				</aside>
				<div className="flex min-w-0 flex-1 flex-col">
					<div className="flex gap-2 overflow-x-auto border-b p-3 md:hidden">
						{sectionIds.map((sectionId) => (
							<Button
								key={sectionId}
								type="button"
								variant={activeSection === sectionId ? "secondary" : "ghost"}
								size="sm"
								className="shrink-0"
								onClick={() => setActiveSection(sectionId)}
							>
								{t(sectionMeta[sectionId].labelKey)}
							</Button>
						))}
					</div>
					<ScrollArea className="min-h-0 flex-1">
						<div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-5 pb-12 lg:p-8">
							{activeSection === "appearance" && <AppearanceSettings />}
							{activeSection === "language" && <LanguageSettings />}
							{activeSection === "navigation" && <NavigationSettings />}
							{activeSection === "calendar" && <CalendarSettings />}
							{activeSection === "notifications" && <NotificationSettings />}
							{activeSection === "downloads" && <DownloadSettings />}
							{activeSection === "cache" && <CacheSettings />}
							{activeSection === "pdf" && <PdfSettings />}
							{activeSection === "appUpdates" && <AppUpdatesSettings />}
							{activeSection === "privacy" && <PrivacySettings />}
							{activeSection === "advanced" && <AdvancedSettings />}
						</div>
					</ScrollArea>
				</div>
			</div>
		</div>
	);
}

function AppearanceSettings() {
	const { settings, setSetting } = useSettings();
	const t = useT();

	return (
		<SettingsGroup>
			<SettingRow
				title={t("settings.appearance.theme.title")}
				description={t("settings.appearance.theme.description")}
			>
				<Select
					value={settings.theme}
					onValueChange={(value) =>
						void setSetting("theme", value as ThemeSetting)
					}
				>
					<SelectTrigger className="w-[180px]">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="system">
							{t("settings.options.system")}
						</SelectItem>
						<SelectItem value="light">{t("settings.options.light")}</SelectItem>
						<SelectItem value="dark">{t("settings.options.dark")}</SelectItem>
					</SelectContent>
				</Select>
			</SettingRow>
			<SettingSwitch
				settingKey="CustomTitleBarButtons"
				title={t("settings.appearance.customTitlebar.title")}
				description={t("settings.appearance.customTitlebar.description")}
			/>
		</SettingsGroup>
	);
}

function LanguageSettings() {
	const { settings, setSetting } = useSettings();
	const t = useT();

	return (
		<SettingsGroup>
			<SettingRow
				title={t("settings.language.title")}
				description={t("settings.language.description")}
			>
				<Select
					value={settings.language}
					onValueChange={(value) =>
						void setSetting("language", value as LanguageSetting)
					}
				>
					<SelectTrigger className="w-[180px]">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{(
							[
								["system", t("settings.options.system")],
								["da", t("settings.options.danish")],
								["en", t("settings.options.english")],
							] as Array<[LanguageSetting, string]>
						).map(([value, label]) => (
							<SelectItem key={value} value={value}>
								{label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</SettingRow>
		</SettingsGroup>
	);
}

function NavigationSettings() {
	const { settings, setSetting } = useSettings();
	const t = useT();

	return (
		<SettingsGroup>
			<SettingRow
				title={t("settings.navigation.defaultLanding.title")}
				description={t("settings.navigation.defaultLanding.description")}
			>
				<Select
					value={settings.defaultLandingPage}
					onValueChange={(value) =>
						void setSetting("defaultLandingPage", value as LandingPageSetting)
					}
				>
					<SelectTrigger className="w-[180px]">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{(
							[
								["overview", t("settings.options.overview")],
								["courses", t("settings.options.courses")],
								["calendar", t("settings.options.calendar")],
								["tasks", t("settings.options.tasks")],
								["messages", t("settings.options.messages")],
							] as Array<[LandingPageSetting, string]>
						).map(([value, label]) => (
							<SelectItem key={value} value={value}>
								{label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</SettingRow>
			<SettingRow
				title={t("settings.navigation.courseSort.title")}
				description={t("settings.navigation.courseSort.description")}
			>
				<Select
					value={settings.courseSortBy}
					onValueChange={(value) =>
						void setSetting(
							"courseSortBy",
							value as SettingsOptions["courseSortBy"],
						)
					}
				>
					<SelectTrigger className="w-[180px]">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="LastOnline">
							{t("settings.navigation.courseSort.lastOnline")}
						</SelectItem>
						<SelectItem value="LastUpdated">
							{t("settings.navigation.courseSort.lastUpdated")}
						</SelectItem>
						<SelectItem value="Title">
							{t("settings.navigation.courseSort.titleOption")}
						</SelectItem>
						<SelectItem value="Rank">
							{t("settings.navigation.courseSort.rank")}
						</SelectItem>
					</SelectContent>
				</Select>
			</SettingRow>
			<SettingRow
				title={t("settings.navigation.sidebarDensity.title")}
				description={t("settings.navigation.sidebarDensity.description")}
			>
				<Select
					value={settings.sidebarDensity}
					onValueChange={(value) =>
						void setSetting("sidebarDensity", value as SidebarDensitySetting)
					}
				>
					<SelectTrigger className="w-[180px]">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="comfortable">
							{t("settings.options.comfortable")}
						</SelectItem>
						<SelectItem value="compact">
							{t("settings.options.compact")}
						</SelectItem>
					</SelectContent>
				</Select>
			</SettingRow>
		</SettingsGroup>
	);
}

function CalendarSettings() {
	const { settings, setSetting } = useSettings();
	const t = useT();

	return (
		<SettingsGroup>
			<SettingRow
				title={t("settings.calendar.defaultView.title")}
				description={t("settings.calendar.defaultView.description")}
			>
				<Select
					value={settings.calendarDefaultView}
					onValueChange={(value) =>
						void setSetting("calendarDefaultView", value as CalendarViewSetting)
					}
				>
					<SelectTrigger className="w-[180px]">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="agenda">{t("calendar.agenda")}</SelectItem>
						<SelectItem value="month">{t("calendar.month")}</SelectItem>
						<SelectItem value="week">{t("calendar.week")}</SelectItem>
						<SelectItem value="day">{t("calendar.day")}</SelectItem>
					</SelectContent>
				</Select>
			</SettingRow>
			<SettingRow
				title={t("settings.calendar.weekStartsOn.title")}
				description={t("settings.calendar.weekStartsOn.description")}
			>
				<Select
					value={settings.calendarWeekStartsOn}
					onValueChange={(value) =>
						void setSetting(
							"calendarWeekStartsOn",
							value as CalendarWeekStartSetting,
						)
					}
				>
					<SelectTrigger className="w-[180px]">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="monday">Monday</SelectItem>
						<SelectItem value="sunday">Sunday</SelectItem>
					</SelectContent>
				</Select>
			</SettingRow>
			<SettingSwitch
				settingKey="calendarShowWeekends"
				title={t("settings.calendar.showWeekends.title")}
				description={t("settings.calendar.showWeekends.description")}
			/>
		</SettingsGroup>
	);
}

function NotificationSettings() {
	const { settings, setSetting } = useSettings();
	const t = useT();
	const [permission, setPermission] = useState(() =>
		"Notification" in window ? Notification.permission : "unsupported",
	);

	return (
		<SettingsGroup>
			<SettingRow
				title={t("settings.notifications.permission.title")}
				description={t("settings.notifications.permission.description")}
			>
				<div className="flex items-center gap-2">
					<Badge variant="outline">{permission}</Badge>
					{"Notification" in window && permission === "default" && (
						<Button
							variant="outline"
							size="sm"
							onClick={() => {
								void Notification.requestPermission().then(setPermission);
							}}
						>
							{t("common.allow")}
						</Button>
					)}
				</div>
			</SettingRow>
			<SettingSwitch
				settingKey="notificationsMessages"
				title={t("settings.notifications.messages.title")}
				description={t("settings.notifications.messages.description")}
			/>
			<SettingSwitch
				settingKey="notificationsTasks"
				title={t("settings.notifications.tasks.title")}
				description={t("settings.notifications.tasks.description")}
			/>
			<SettingSwitch
				settingKey="notificationsAppUpdates"
				title={t("settings.notifications.updates.title")}
				description={t("settings.notifications.updates.description")}
			/>
			<SettingSwitch
				settingKey="notificationQuietHoursEnabled"
				title={t("settings.notifications.quietHours.title")}
				description={t("settings.notifications.quietHours.description")}
			/>
			{settings.notificationQuietHoursEnabled && (
				<div className="grid grid-cols-1 gap-4 rounded-md border bg-muted/20 p-4 sm:grid-cols-2">
					<div className="space-y-2">
						<Label htmlFor="quiet-start">{t("common.start")}</Label>
						<Input
							id="quiet-start"
							type="time"
							value={settings.notificationQuietHoursStart}
							onChange={(event) =>
								void setSetting(
									"notificationQuietHoursStart",
									event.target.value,
								)
							}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="quiet-end">{t("common.end")}</Label>
						<Input
							id="quiet-end"
							type="time"
							value={settings.notificationQuietHoursEnd}
							onChange={(event) =>
								void setSetting("notificationQuietHoursEnd", event.target.value)
							}
						/>
					</div>
				</div>
			)}
		</SettingsGroup>
	);
}

function DownloadSettings() {
	const { settings, setSetting, chooseDownloadDirectory } = useSettings();
	const [systemDownloadPath, setSystemDownloadPath] = useState("");
	const t = useT();

	useEffect(() => {
		void window.app.getPath("downloads").then(setSystemDownloadPath);
	}, []);

	return (
		<SettingsGroup>
			<SettingRow
				title={t("settings.downloads.folder.title")}
				description={t("settings.downloads.folder.description")}
			>
				<div className="flex max-w-md items-center gap-2">
					<div className="min-w-0 truncate rounded-md border bg-muted/30 px-3 py-2 text-sm">
						{settings.downloadDirectory ?? systemDownloadPath ?? "Downloads"}
					</div>
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={() => void chooseDownloadDirectory()}
					>
						{t("common.choose")}
					</Button>
					{settings.downloadDirectory && (
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={() => void setSetting("downloadDirectory", null)}
						>
							{t("common.reset")}
						</Button>
					)}
				</div>
			</SettingRow>
			<SettingRow
				title={t("settings.downloads.after.title")}
				description={t("settings.downloads.after.description")}
			>
				<Select
					value={settings.downloadAutoOpen}
					onValueChange={(value) =>
						void setSetting(
							"downloadAutoOpen",
							value as DownloadAutoOpenSetting,
						)
					}
				>
					<SelectTrigger className="w-[180px]">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{downloadAutoOpenOptions.map((value) => (
							<SelectItem key={value} value={value}>
								{value === "never"
									? t("settings.options.never")
									: value === "file"
										? t("settings.options.file")
										: t("settings.options.folder")}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</SettingRow>
		</SettingsGroup>
	);
}

function CacheSettings() {
	const { setShowSettingsModal } = useShowSettingsModal();
	const { settings, setSetting } = useSettings();
	const { locale } = useLocale();
	const t = useT();
	const [cacheInfo, setCacheInfo] = useState({
		count: 0,
		size: 0,
		cachedCount: 0,
		missingCount: 0,
		staleCount: 0,
		failedCount: 0,
		isLoading: true,
	});

	const refreshCacheInfo = async () => {
		setCacheInfo((current) => ({ ...current, isLoading: true }));
		const db = await ItsduResourcesDBWrapper.getInstance();
		const health = await db.getCacheHealth();
		setCacheInfo({
			count: health.totalCount,
			size: health.totalSize,
			cachedCount: health.cachedCount,
			missingCount: health.missingCount,
			staleCount: health.staleCount,
			failedCount: health.failedCount,
			isLoading: false,
		});
	};

	useEffect(() => {
		void refreshCacheInfo();
	}, []);

	const clearCache = async () => {
		const db = await ItsduResourcesDBWrapper.getInstance();
		await db.clearResources();
		await refreshCacheInfo();
		sonnerToast.success(t("settings.cache.clearAll.success"));
	};

	const clearProblemCache = async () => {
		const db = await ItsduResourcesDBWrapper.getInstance();
		const removed = await db.clearProblemResources();
		await refreshCacheInfo();
		sonnerToast.success(
			removed === 0
				? t("settings.cache.clearProblem.empty")
				: t("settings.cache.clearProblem.removed", {
						count: removed,
						suffix: removed === 1 ? "" : "s",
					}),
		);
	};

	return (
		<SettingsGroup>
			<SettingRow
				title={t("settings.cache.usage.title")}
				description={t("settings.cache.usage.description")}
			>
				<div className="flex items-center gap-3">
					<Badge variant="outline">
						{cacheInfo.isLoading
							? t("common.calculating")
							: `${cacheInfo.count} files, ${formatFileSize(cacheInfo.size, locale)}`}
					</Badge>
					{!cacheInfo.isLoading && (
						<Badge
							variant="outline"
							className={
								cacheInfo.missingCount + cacheInfo.failedCount > 0
									? "border-amber-500/40 text-amber-600 dark:text-amber-400"
									: "border-emerald-500/40 text-emerald-600 dark:text-emerald-400"
							}
						>
							{t("settings.cache.healthy", { count: cacheInfo.cachedCount })}
							{cacheInfo.missingCount + cacheInfo.failedCount > 0
								? `, ${t("settings.cache.needsCleanup", {
										count: cacheInfo.missingCount + cacheInfo.failedCount,
									})}`
								: ""}
						</Badge>
					)}
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={() => void refreshCacheInfo()}
					>
						<RefreshCcw className="mr-2 h-3.5 w-3.5" />
						{t("common.retry")}
					</Button>
				</div>
			</SettingRow>
			<SettingRow
				title={t("settings.cache.behavior.title")}
				description={t("settings.cache.behavior.description")}
			>
				<Select
					value={settings.resourceCacheMode}
					onValueChange={(value) =>
						void setSetting(
							"resourceCacheMode",
							value as ResourceCacheModeSetting,
						)
					}
				>
					<SelectTrigger className="w-[220px]">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{resourceCacheModeOptions.map((value) => (
							<SelectItem key={value} value={value}>
								{value === "opened"
									? t("settings.options.opened")
									: value === "pdf-only"
										? t("settings.options.pdfOnly")
										: t("settings.options.manual")}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</SettingRow>
			<SettingRow
				title={t("settings.cache.maxSize.title")}
				description={t("settings.cache.maxSize.description")}
			>
				<div className="flex items-center gap-2">
					<Input
						type="number"
						min={50}
						max={10240}
						step={50}
						className="w-28"
						value={settings.resourceCacheMaxSizeMb}
						onChange={(event) => {
							const value = Number(event.target.value);
							if (!Number.isFinite(value)) return;
							void setSetting("resourceCacheMaxSizeMb", value);
						}}
					/>
					<span className="text-sm text-muted-foreground">MB</span>
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={async () => {
							const db = await ItsduResourcesDBWrapper.getInstance();
							const removed = await db.enforceMaxSize(
								settings.resourceCacheMaxSizeMb * 1024 * 1024,
							);
							await refreshCacheInfo();
							sonnerToast.success(
								removed
									? `Evicted ${removed} old resource${removed === 1 ? "" : "s"}`
									: t("settings.cache.limitWithin"),
							);
						}}
					>
						{t("settings.cache.applyLimit")}
					</Button>
				</div>
			</SettingRow>
			<SettingRow
				title={t("settings.cache.browse.title")}
				description={t("settings.cache.browse.description")}
			>
				<Button asChild type="button" variant="outline" size="sm">
					<Link to="/resources" onClick={() => setShowSettingsModal(false)}>
						{t("common.open")}
					</Link>
				</Button>
			</SettingRow>
			<SettingRow
				title={t("settings.cache.clearProblem.title")}
				description={t("settings.cache.clearProblem.description")}
			>
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={() => void clearProblemCache()}
				>
					<Trash2 className="mr-2 h-3.5 w-3.5" />
					{t("settings.cache.clearProblem.action")}
				</Button>
			</SettingRow>
			<SettingRow
				title={t("settings.cache.clearAll.title")}
				description={t("settings.cache.clearAll.description")}
			>
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button type="button" variant="destructive" size="sm">
							<Trash2 className="mr-2 h-3.5 w-3.5" />
							{t("common.clear")}
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>
								{t("settings.cache.clearAll.confirm.title")}
							</AlertDialogTitle>
							<AlertDialogDescription>
								{t("settings.cache.clearAll.confirm.description")}
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
							<AlertDialogAction onClick={() => void clearCache()}>
								{t("common.clear")}
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</SettingRow>
		</SettingsGroup>
	);
}

function PdfSettings() {
	const { settings } = useSettings();
	const t = useT();

	return (
		<SettingsGroup>
			<SettingSwitch
				settingKey="CustomPDFrenderer"
				title={t("settings.pdf.useViewer.title")}
				description={t("settings.pdf.useViewer.description")}
			/>
			{settings.CustomPDFrenderer && (
				<SettingSwitch
					settingKey="pdfAIChatSidepanelOpenByDefault"
					title={t("settings.pdf.aiPanel.title")}
					description={t("settings.pdf.aiPanel.description")}
				/>
			)}
			<SettingSwitch
				settingKey="CustomPDFSidebarOpened"
				title={t("settings.pdf.sidebar.title")}
				description={t("settings.pdf.sidebar.description")}
			/>
		</SettingsGroup>
	);
}

function AppUpdatesSettings() {
	const { version } = useVersion();
	const t = useT();
	const [status, setStatus] = useState<UpdateStatus>("idle");
	const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
	const [downloadProgress, setDownloadProgress] = useState(0);
	const [error, setError] = useState<string | null>(null);

	const isUpdateAvailable =
		updateInfo?.version !== undefined && updateInfo.version !== version;
	const isBusy =
		status === "checking" ||
		status === "downloading" ||
		status === "installing";

	useEffect(() => {
		const onDownloaded = (_event: unknown, info?: UpdateInfo) => {
			if (info) setUpdateInfo(info);
			setDownloadProgress(100);
			setStatus("downloaded");
		};
		const onProgress = (_event: unknown, progress?: DownloadProgress) => {
			setDownloadProgress(progress?.percent ?? 0);
		};

		window.ipcRenderer.on("app:updateDownloaded", onDownloaded);
		window.ipcRenderer.on("app:downloadProgress", onProgress);

		return () => {
			window.ipcRenderer.removeListener("app:updateDownloaded", onDownloaded);
			window.ipcRenderer.removeListener("app:downloadProgress", onProgress);
		};
	}, []);

	const checkForUpdates = async () => {
		setStatus("checking");
		setError(null);
		try {
			const result = await window.app.checkForUpdates();
			setUpdateInfo(result);
			setStatus(
				result?.version !== undefined && result.version !== version
					? "available"
					: "current",
			);
		} catch (caught) {
			console.error(caught);
			setStatus("error");
			setError(getUpdateErrorMessage(caught));
		}
	};

	const downloadUpdate = async () => {
		if (!isUpdateAvailable) return;

		setStatus("downloading");
		setDownloadProgress(0);
		setError(null);

		try {
			await window.app.downloadUpdate();
			setStatus((current) =>
				current === "downloading" ? "downloaded" : current,
			);
		} catch (caught) {
			console.error(caught);
			setStatus("error");
			setError(getUpdateErrorMessage(caught));
		}
	};

	const installUpdate = async () => {
		setStatus("installing");
		setError(null);
		try {
			await window.app.update();
			await window.app.exit();
		} catch (caught) {
			console.error(caught);
			setStatus("error");
			setError(getUpdateErrorMessage(caught));
		}
	};

	return (
		<SettingsGroup>
			<SettingRow
				title={t("settings.appUpdates.version.title")}
				description={t("settings.appUpdates.version.description")}
			>
				<Badge variant="outline">v{version}</Badge>
			</SettingRow>
			<SettingRow
				title={t("settings.appUpdates.status.title")}
				description={
					import.meta.env.DEV
						? t("settings.appUpdates.devModeNotice")
						: t("settings.appUpdates.status.description")
				}
			>
				<div className="flex min-w-[220px] flex-col items-start gap-2 sm:items-end">
					<Badge variant={status === "error" ? "destructive" : "outline"}>
						{getUpdateStatusLabel(status, isUpdateAvailable, t)}
					</Badge>
					{updateInfo?.version && (
						<p className="text-xs text-muted-foreground">
							{t("settings.appUpdates.latestChecked", {
								version: updateInfo.version,
							})}
						</p>
					)}
					{error && (
						<p className="max-w-[260px] text-right text-xs text-destructive">
							{error}
						</p>
					)}
				</div>
			</SettingRow>
			{status === "downloading" && (
				<SettingRow
					title={t("settings.appUpdates.download.title")}
					description={t("settings.appUpdates.download.description")}
				>
					<div className="flex min-w-[220px] flex-col gap-2">
						<Progress value={downloadProgress} />
						<p className="text-right text-xs text-muted-foreground">
							{downloadProgress.toFixed(0)}%
						</p>
					</div>
				</SettingRow>
			)}
			<SettingRow
				title={t("settings.appUpdates.check.title")}
				description={t("settings.appUpdates.check.description")}
			>
				<div className="flex flex-wrap justify-start gap-2 sm:justify-end">
					<Button
						type="button"
						variant="outline"
						size="sm"
						disabled={isBusy}
						onClick={() => void checkForUpdates()}
					>
						<RefreshCcw className="mr-2 h-3.5 w-3.5" />
						{status === "checking"
							? t("settings.appUpdates.checking")
							: t("settings.appUpdates.check.title")}
					</Button>
					{isUpdateAvailable && status !== "downloaded" && (
						<Button
							type="button"
							size="sm"
							disabled={isBusy}
							onClick={() => void downloadUpdate()}
						>
							{t("settings.appUpdates.download.title")} v{updateInfo?.version}
						</Button>
					)}
					{(status === "downloaded" || status === "installing") && (
						<Button
							type="button"
							size="sm"
							disabled={status === "installing"}
							onClick={() => void installUpdate()}
						>
							{status === "installing"
								? t("settings.appUpdates.installing")
								: t("common.install")}
						</Button>
					)}
				</div>
			</SettingRow>
			<SettingSwitch
				settingKey="updatesAutoCheckOnStartup"
				title={t("settings.appUpdates.check.title")}
				description={t("settings.appUpdates.autoCheck.description")}
			/>
		</SettingsGroup>
	);
}

function PrivacySettings() {
	const t = useT();
	return (
		<SettingsGroup>
			<SettingSwitch
				settingKey="UploadAIChats"
				title={t("settings.privacy.uploadAi.title")}
				description={t("settings.privacy.uploadAi.description")}
			/>
		</SettingsGroup>
	);
}

function AdvancedSettings() {
	const { settings, resetAllSettings } = useSettings();
	const { version } = useVersion();
	const t = useT();

	const copyDiagnostics = async () => {
		const db = await ItsduResourcesDBWrapper.getInstance();
		const resources = await db.getAllResources();
		const cacheSize = resources.reduce(
			(total, resource) => total + resource.size,
			0,
		);

		const diagnostics = {
			version,
			userAgent: navigator.userAgent,
			cache: { files: resources.length, size: formatSize(cacheSize) },
			settings,
		};

		await navigator.clipboard.writeText(JSON.stringify(diagnostics, null, 2));
		sonnerToast.success("Diagnostics copied to clipboard");
	};

	return (
		<SettingsGroup>
			<SettingRow
				title={t("settings.privacy.copyDiagnostics.title")}
				description={t("settings.privacy.copyDiagnostics.description")}
			>
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={() => void copyDiagnostics()}
				>
					{t("settings.privacy.copyDiagnostics.action")}
				</Button>
			</SettingRow>
			<SettingRow
				title={t("settings.advanced.resetAll.title")}
				description={t("settings.advanced.resetAll.description")}
			>
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button type="button" variant="destructive" size="sm">
							{t("common.reset")}
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>
								{t("settings.advanced.resetAll.confirm.title")}
							</AlertDialogTitle>
							<AlertDialogDescription>
								{t("settings.advanced.resetAll.confirm.description")}
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
							<AlertDialogAction onClick={() => void resetAllSettings()}>
								{t("common.reset")}
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</SettingRow>
			<Separator />
			<div className="rounded-md border bg-muted/20 p-4">
				<div className="flex items-center gap-2">
					<BookOpen className="h-4 w-4 text-muted-foreground" />
					<h3 className="font-medium">
						{t("settings.advanced.deferred.title")}
					</h3>
				</div>
				<p className="mt-2 text-sm text-muted-foreground">
					{t("settings.advanced.deferred.description")}
				</p>
			</div>
		</SettingsGroup>
	);
}

function SettingSwitch({
	settingKey,
	title,
	description,
}: {
	settingKey: SettingsKey;
	title: string;
	description: string;
}) {
	const { settings, setSetting } = useSettings();
	const checked = Boolean(settings[settingKey]);

	return (
		<SettingRow title={title} description={description}>
			<Switch
				checked={checked}
				onCheckedChange={(value) => void setSetting(settingKey, value as never)}
			/>
		</SettingRow>
	);
}

function SettingsGroup({ children }: { children: React.ReactNode }) {
	const childArray = useMemo(() => {
		return Array.isArray(children) ? children : [children];
	}, [children]);

	return (
		<div className="overflow-hidden rounded-md border bg-card">
			{childArray.map((child, index) => (
				<div key={index}>
					{index > 0 && <Separator />}
					{child}
				</div>
			))}
		</div>
	);
}

function SettingRow({
	title,
	description,
	children,
}: {
	title: string;
	description: string;
	children: React.ReactNode;
}) {
	return (
		<div className="grid gap-4 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
			<div className="min-w-0">
				<h3 className="font-medium">{title}</h3>
				<p className="mt-1 text-sm text-muted-foreground">{description}</p>
			</div>
			<div className="flex justify-start sm:justify-end">{children}</div>
		</div>
	);
}

function formatSize(size: number) {
	if (size < 1024) return `${size} B`;
	if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
	if (size < 1024 * 1024 * 1024) {
		return `${Math.round(size / 1024 / 1024)} MB`;
	}
	return `${Math.round(size / 1024 / 1024 / 1024)} GB`;
}

function getUpdateStatusLabel(
	status: UpdateStatus,
	isUpdateAvailable: boolean,
	t: (key: TranslationKey) => string,
) {
	switch (status) {
		case "checking":
			return t("common.checking");
		case "current":
			return t("common.upToDate");
		case "available":
			return t("settings.appUpdates.download.title");
		case "downloading":
			return t("common.downloading");
		case "downloaded":
			return t("common.readyToInstall");
		case "installing":
			return t("common.installing");
		case "error":
			return t("errors.updateCheck");
		default:
			return isUpdateAvailable
				? t("settings.appUpdates.download.title")
				: t("common.notChecked");
	}
}
