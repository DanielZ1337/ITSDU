import {
	BrowserWindow,
	dialog,
	nativeTheme,
	type OpenDialogOptions,
} from "electron";
import Store from "electron-store";
import {
	defaultSettings,
	getSetting,
	hasLegacySettingKeys,
	isSettingsPath,
	normalizeSettings,
	type SettingsOptions,
	type SettingsPath,
	type SettingValue,
	settingPaths,
	validateSetting,
} from "../../../src/types/settings";
import { handle } from "../../ipc/secure";
import { themeStore } from "../theme/theme-service";

// The store holds the grouped shape ({ notifications: { messages: true } }); electron-store reads and writes it by
// dotted path ("notifications.messages"). Older versions wrote flat keys ("notificationsMessages").
type SettingsStore = Record<string, unknown>;

function assertPath(path: unknown): asserts path is SettingsPath {
	if (!isSettingsPath(path))
		throw new Error(`Unknown setting: ${String(path)}`);
}

export class SettingsService {
	private static instance: SettingsService;
	private readonly store: Store<SettingsStore>;
	private readonly listeners = new Set<(settings: SettingsOptions) => void>();

	private constructor() {
		this.store = new Store<SettingsStore>({
			watch: true,
			name: "itsdu-settings",
		});

		this.migrateFlatStore();
		this.ensureDefaults();
		this.applySideEffects(this.getAll());
		this.registerIpcListeners();
	}

	static getInstance(): SettingsService {
		if (!SettingsService.instance) {
			SettingsService.instance = new SettingsService();
		}
		return SettingsService.instance;
	}

	getAll(): SettingsOptions {
		return normalizeSettings(this.store.store);
	}

	get<P extends SettingsPath>(path: P): SettingValue<P> {
		return validateSetting(path, this.store.get(path));
	}

	set<P extends SettingsPath>(
		path: P,
		value: SettingValue<P>,
	): SettingsOptions {
		this.store.set(path, validateSetting(path, value));
		return this.commit();
	}

	reset(path: SettingsPath): SettingsOptions {
		this.store.set(path, getSetting(defaultSettings, path));
		return this.commit();
	}

	resetAll(): SettingsOptions {
		this.store.clear();
		this.store.set(defaultSettings);
		return this.commit();
	}

	/**
	 * Import values saved by an older renderer (grouped or flat). A value is only taken over while the current one is
	 * still the default, so anything the user already changed is kept.
	 */
	migrate(values: unknown): SettingsOptions {
		const incoming = normalizeSettings(values);
		for (const path of settingPaths) {
			const current = this.get(path);
			if (current !== getSetting(defaultSettings, path)) continue;
			this.store.set(path, getSetting(incoming, path));
		}
		return this.commit();
	}

	getDownloadDirectory() {
		return this.get("downloads.directory") ?? undefined;
	}

	subscribe(listener: (settings: SettingsOptions) => void) {
		this.listeners.add(listener);
		return () => this.listeners.delete(listener);
	}

	/** One-time: rewrite a store that still has the old flat keys into the grouped shape. */
	private migrateFlatStore() {
		if (!hasLegacySettingKeys(this.store.store)) return;
		const migrated = normalizeSettings(this.store.store);
		this.store.clear();
		this.store.set(migrated);
	}

	private ensureDefaults() {
		for (const path of settingPaths) {
			this.store.set(path, validateSetting(path, this.store.get(path)));
		}
	}

	private commit(): SettingsOptions {
		const settings = this.getAll();
		this.applySideEffects(settings);
		this.emitChange(settings);
		return settings;
	}

	private applySideEffects(settings: SettingsOptions) {
		nativeTheme.themeSource = settings.appearance.theme;
		themeStore.set(
			"theme",
			settings.appearance.theme === "system"
				? nativeTheme.shouldUseDarkColors
					? "dark"
					: "light"
				: settings.appearance.theme,
		);
	}

	private emitChange(settings: SettingsOptions) {
		for (const listener of this.listeners) {
			listener(settings);
		}
		for (const window of BrowserWindow.getAllWindows()) {
			window.webContents.send("settings:changed", settings);
		}
	}

	private registerIpcListeners(): void {
		handle("settings:getAll", () => this.getAll());

		handle("settings:get", (_, path: SettingsPath) => {
			assertPath(path);
			return this.get(path);
		});

		handle(
			"settings:set",
			(_, path: SettingsPath, value: SettingValue<SettingsPath>) => {
				assertPath(path);
				return this.set(path, value as never);
			},
		);

		handle("settings:reset", (_, path: SettingsPath) => {
			assertPath(path);
			return this.reset(path);
		});

		handle("settings:resetAll", () => {
			return this.resetAll();
		});

		handle("settings:migrateLocalStorage", (_, values) => {
			return this.migrate(values);
		});

		handle("settings:chooseDownloadDirectory", async (event) => {
			const window = BrowserWindow.fromWebContents(event.sender);
			const dialogOptions: OpenDialogOptions = {
				title: "Choose download folder",
				properties: ["openDirectory", "createDirectory"],
			};
			const result = window
				? await dialog.showOpenDialog(window, dialogOptions)
				: await dialog.showOpenDialog(dialogOptions);

			if (result.canceled || !result.filePaths[0]) {
				return this.getAll();
			}

			return this.set("downloads.directory", result.filePaths[0]);
		});
	}
}

export default SettingsService;
