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
import { ItsduResourcesDBWrapper } from "@/lib/resource-indexeddb/resourceIndexedDB";
import {
	type CalendarViewSetting,
	type CalendarWeekStartSetting,
	type DownloadAutoOpenSetting,
	type LandingPageSetting,
	type LanguageSetting,
	type SettingsKey,
	type SettingsOptions,
	type SidebarDensitySetting,
	type ThemeSetting,
	downloadAutoOpenOptions,
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
import { toast as sonnerToast } from "sonner";

const landingLabels: Record<LandingPageSetting, string> = {
	overview: "Overview",
	courses: "Courses",
	calendar: "Calendar",
	tasks: "Tasks",
	messages: "Messages",
};

const languageLabels: Record<LanguageSetting, string> = {
	system: "System",
	da: "Danish",
	en: "English",
};

const autoOpenLabels: Record<DownloadAutoOpenSetting, string> = {
	never: "Do not open",
	file: "Open file",
	folder: "Show in folder",
};

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

const sectionIds = [
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

type SectionId = (typeof sectionIds)[number];

const sectionMeta: Record<
	SectionId,
	{ label: string; icon: React.ReactNode; description: string }
> = {
	appearance: {
		label: "Appearance",
		icon: <Brush className="h-4 w-4" />,
		description: "Theme and window controls.",
	},
	language: {
		label: "Language",
		icon: <Globe2 className="h-4 w-4" />,
		description: "Locale preferences used by supported app surfaces.",
	},
	navigation: {
		label: "Navigation",
		icon: <LayoutDashboard className="h-4 w-4" />,
		description: "Startup destination and navigation density.",
	},
	calendar: {
		label: "Calendar",
		icon: <CalendarDays className="h-4 w-4" />,
		description: "Planner view defaults.",
	},
	notifications: {
		label: "Notifications",
		icon: <Bell className="h-4 w-4" />,
		description: "Desktop notification behavior.",
	},
	downloads: {
		label: "Downloads",
		icon: <Download className="h-4 w-4" />,
		description: "Where files go after download.",
	},
	cache: {
		label: "Cache",
		icon: <Database className="h-4 w-4" />,
		description: "Local resource cache stored in IndexedDB.",
	},
	pdf: {
		label: "PDF",
		icon: <FileText className="h-4 w-4" />,
		description: "PDF viewer defaults.",
	},
	appUpdates: {
		label: "App & Updates",
		icon: <Info className="h-4 w-4" />,
		description: "Version and update controls.",
	},
	privacy: {
		label: "Privacy",
		icon: <Lock className="h-4 w-4" />,
		description: "Data sharing and AI upload controls.",
	},
	advanced: {
		label: "Advanced",
		icon: <Settings2 className="h-4 w-4" />,
		description: "Reset and app foundation settings.",
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
	const [activeSection, setActiveSection] = useState<SectionId>("appearance");
	const section = sectionMeta[activeSection];

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
							{section.label}
						</h2>
						<p className="truncate text-sm text-muted-foreground">
							{section.description}
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
								{sectionMeta[sectionId].label}
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
								{sectionMeta[sectionId].label}
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

	return (
		<SettingsGroup>
			<SettingRow
				title="Theme"
				description="Use the OS theme or choose a fixed light/dark mode."
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
						<SelectItem value="system">System</SelectItem>
						<SelectItem value="light">Light</SelectItem>
						<SelectItem value="dark">Dark</SelectItem>
					</SelectContent>
				</Select>
			</SettingRow>
			<SettingSwitch
				settingKey="CustomTitleBarButtons"
				title="Custom window buttons"
				description="Use ITSDU-styled window controls in the titlebar."
			/>
		</SettingsGroup>
	);
}

function LanguageSettings() {
	const { settings, setSetting } = useSettings();

	return (
		<SettingsGroup>
			<SettingRow
				title="App language"
				description="Stored now and used by supported labels as localization expands."
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
						{Object.entries(languageLabels).map(([value, label]) => (
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

	return (
		<SettingsGroup>
			<SettingRow
				title="Default landing page"
				description="Where the app sends you when opening Home."
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
						{Object.entries(landingLabels).map(([value, label]) => (
							<SelectItem key={value} value={value}>
								{label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</SettingRow>
			<SettingRow
				title="Course sort"
				description="Default sort order for the Courses screen."
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
						<SelectItem value="LastOnline">Last online</SelectItem>
						<SelectItem value="LastUpdated">Last updated</SelectItem>
						<SelectItem value="Title">Title</SelectItem>
						<SelectItem value="Rank">Rank</SelectItem>
					</SelectContent>
				</Select>
			</SettingRow>
			<SettingRow title="Sidebar density" description="Adjust sidebar spacing.">
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
						<SelectItem value="comfortable">Comfortable</SelectItem>
						<SelectItem value="compact">Compact</SelectItem>
					</SelectContent>
				</Select>
			</SettingRow>
		</SettingsGroup>
	);
}

function CalendarSettings() {
	const { settings, setSetting } = useSettings();

	return (
		<SettingsGroup>
			<SettingRow
				title="Default calendar view"
				description="The Calendar page opens in this view."
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
						<SelectItem value="agenda">Agenda</SelectItem>
						<SelectItem value="month">Month</SelectItem>
						<SelectItem value="week">Week</SelectItem>
						<SelectItem value="day">Day</SelectItem>
					</SelectContent>
				</Select>
			</SettingRow>
			<SettingRow
				title="Week starts on"
				description="Controls the week and month grid layout."
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
				title="Show weekends"
				description="Include Saturday and Sunday in month and week views."
			/>
		</SettingsGroup>
	);
}

function NotificationSettings() {
	const { settings, setSetting } = useSettings();
	const [permission, setPermission] = useState(() =>
		"Notification" in window ? Notification.permission : "unsupported",
	);

	return (
		<SettingsGroup>
			<SettingRow
				title="System permission"
				description="Desktop notifications require browser notification permission."
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
							Allow
						</Button>
					)}
				</div>
			</SettingRow>
			<SettingSwitch
				settingKey="notificationsMessages"
				title="Message notifications"
				description="Poll gently for unread messages and show desktop notifications."
			/>
			<SettingSwitch
				settingKey="notificationsTasks"
				title="Task notifications"
				description="Stored for task notification surfaces as they are enabled."
			/>
			<SettingSwitch
				settingKey="notificationsAppUpdates"
				title="App update notifications"
				description="Show a toast when a new app update is available."
			/>
			<SettingSwitch
				settingKey="notificationQuietHoursEnabled"
				title="Quiet hours"
				description="Suppress desktop notifications during a daily window."
			/>
			{settings.notificationQuietHoursEnabled && (
				<div className="grid grid-cols-1 gap-4 rounded-md border bg-muted/20 p-4 sm:grid-cols-2">
					<div className="space-y-2">
						<Label htmlFor="quiet-start">Start</Label>
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
						<Label htmlFor="quiet-end">End</Label>
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

	useEffect(() => {
		void window.app.getPath("downloads").then(setSystemDownloadPath);
	}, []);

	return (
		<SettingsGroup>
			<SettingRow
				title="Download folder"
				description="Files use the selected folder, or your OS Downloads folder."
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
						Choose
					</Button>
					{settings.downloadDirectory && (
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={() => void setSetting("downloadDirectory", null)}
						>
							Reset
						</Button>
					)}
				</div>
			</SettingRow>
			<SettingRow
				title="After download"
				description="Choose whether completed downloads open automatically."
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
								{autoOpenLabels[value]}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</SettingRow>
		</SettingsGroup>
	);
}

function CacheSettings() {
	const [cacheInfo, setCacheInfo] = useState({
		count: 0,
		size: 0,
		isLoading: true,
	});

	const refreshCacheInfo = async () => {
		setCacheInfo((current) => ({ ...current, isLoading: true }));
		const db = await ItsduResourcesDBWrapper.getInstance();
		const resources = await db.getAllResources();
		setCacheInfo({
			count: resources.length,
			size: resources.reduce((total, resource) => total + resource.size, 0),
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
		sonnerToast.success("Resource cache cleared");
	};

	return (
		<SettingsGroup>
			<SettingRow
				title="Resource cache usage"
				description="Cached resources make recently opened files available faster."
			>
				<div className="flex items-center gap-3">
					<Badge variant="outline">
						{cacheInfo.isLoading
							? "Calculating..."
							: `${cacheInfo.count} files, ${formatSize(cacheInfo.size)}`}
					</Badge>
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={() => void refreshCacheInfo()}
					>
						<RefreshCcw className="mr-2 h-3.5 w-3.5" />
						Refresh
					</Button>
				</div>
			</SettingRow>
			<SettingRow
				title="Clear resource cache"
				description="Removes locally cached files. Course data can be fetched again."
			>
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button type="button" variant="destructive" size="sm">
							<Trash2 className="mr-2 h-3.5 w-3.5" />
							Clear cache
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Clear resource cache?</AlertDialogTitle>
							<AlertDialogDescription>
								This removes all locally cached resource files from IndexedDB.
								It does not delete downloads from your computer.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction onClick={() => void clearCache()}>
								Clear cache
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

	return (
		<SettingsGroup>
			<SettingSwitch
				settingKey="CustomPDFrenderer"
				title="Use ITSDU PDF viewer"
				description="Use the built-in PDF viewer with thumbnails and the AI side panel."
			/>
			{settings.CustomPDFrenderer && (
				<SettingSwitch
					settingKey="pdfAIChatSidepanelOpenByDefault"
					title="Open AI side panel by default"
					description="New PDF sessions open with the AI panel visible when enabled."
				/>
			)}
			<SettingSwitch
				settingKey="CustomPDFSidebarOpened"
				title="Show PDF thumbnails by default"
				description="Controls the thumbnail sidebar in the custom PDF viewer."
			/>
		</SettingsGroup>
	);
}

function AppUpdatesSettings() {
	const { version } = useVersion();
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
				title="Installed version"
				description="The version currently running on this computer."
			>
				<Badge variant="outline">v{version}</Badge>
			</SettingRow>
			<SettingRow
				title="Update status"
				description={
					import.meta.env.DEV
						? "Development builds usually cannot contact the packaged update feed."
						: "Check, download, and install updates from here."
				}
			>
				<div className="flex min-w-[220px] flex-col items-start gap-2 sm:items-end">
					<Badge variant={status === "error" ? "destructive" : "outline"}>
						{getUpdateStatusLabel(status, isUpdateAvailable)}
					</Badge>
					{updateInfo?.version && (
						<p className="text-xs text-muted-foreground">
							Latest checked: v{updateInfo.version}
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
					title="Download progress"
					description="Keep the app open while the update downloads."
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
				title="Manual update check"
				description="Uses the app's existing update service."
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
						{status === "checking" ? "Checking..." : "Check for updates"}
					</Button>
					{isUpdateAvailable && status !== "downloaded" && (
						<Button
							type="button"
							size="sm"
							disabled={isBusy}
							onClick={() => void downloadUpdate()}
						>
							Download v{updateInfo?.version}
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
								? "Installing..."
								: "Install and restart"}
						</Button>
					)}
				</div>
			</SettingRow>
			<SettingSwitch
				settingKey="updatesAutoCheckOnStartup"
				title="Check for updates on startup"
				description="Runs a quiet update check after settings are loaded."
			/>
		</SettingsGroup>
	);
}

function PrivacySettings() {
	return (
		<SettingsGroup>
			<SettingSwitch
				settingKey="UploadAIChats"
				title="Allow AI document uploads"
				description="When off, documents are not uploaded for AI chat indexing."
			/>
		</SettingsGroup>
	);
}

function AdvancedSettings() {
	const { resetAllSettings } = useSettings();

	return (
		<SettingsGroup>
			<SettingRow
				title="Reset app settings"
				description="Restores settings defaults. Cached resources and account data are not cleared."
			>
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button type="button" variant="destructive" size="sm">
							Reset settings
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Reset all settings?</AlertDialogTitle>
							<AlertDialogDescription>
								This restores every setting in this screen to its default value.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction onClick={() => void resetAllSettings()}>
								Reset settings
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</SettingRow>
			<Separator />
			<div className="rounded-md border bg-muted/20 p-4">
				<div className="flex items-center gap-2">
					<BookOpen className="h-4 w-4 text-muted-foreground" />
					<h3 className="font-medium">Deferred foundation settings</h3>
				</div>
				<p className="mt-2 text-sm text-muted-foreground">
					Cache size limits and broader task notification scheduling need
					background enforcement before they become real controls, so they are
					not exposed as toggles yet.
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
) {
	switch (status) {
		case "checking":
			return "Checking...";
		case "current":
			return "Up to date";
		case "available":
			return "Update available";
		case "downloading":
			return "Downloading";
		case "downloaded":
			return "Ready to install";
		case "installing":
			return "Installing";
		case "error":
			return "Update check failed";
		default:
			return isUpdateAvailable ? "Update available" : "Not checked";
	}
}

function getUpdateErrorMessage(error: unknown) {
	if (import.meta.env.DEV) {
		return "Updates are usually unavailable in development builds.";
	}
	if (error instanceof Error && error.message) {
		return error.message;
	}
	return "The update service could not be reached.";
}
