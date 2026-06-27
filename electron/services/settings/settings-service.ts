import {
	BrowserWindow,
	dialog,
	ipcMain,
	nativeTheme,
	type OpenDialogOptions,
} from "electron";
import Store from "electron-store";
import {
	defaultSettings,
	normalizeSettings,
	type SettingsKey,
	type SettingsOptions,
	validateSetting,
} from "../../../src/types/settings";
import { themeStore } from "../theme/theme-service";

type SettingsStore = Partial<SettingsOptions>;

export class SettingsService {
	private static instance: SettingsService;
	private readonly store: Store<SettingsStore>;
	private readonly keysPresentBeforeDefaults: Set<SettingsKey>;

	private constructor() {
		this.store = new Store<SettingsStore>({
			watch: true,
			name: "itsdu-settings",
			defaults: defaultSettings,
		});
		this.keysPresentBeforeDefaults = new Set(
			Object.keys(this.store.store) as SettingsKey[],
		);

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

	get<K extends SettingsKey>(key: K): SettingsOptions[K] {
		return validateSetting(key, this.store.get(key));
	}

	set<K extends SettingsKey>(key: K, value: SettingsOptions[K]): SettingsOptions {
		this.store.set(key, validateSetting(key, value));
		const settings = this.getAll();
		this.applySideEffects(settings);
		this.emitChange(settings);
		return settings;
	}

	reset(key: SettingsKey): SettingsOptions {
		this.store.set(key, defaultSettings[key]);
		const settings = this.getAll();
		this.applySideEffects(settings);
		this.emitChange(settings);
		return settings;
	}

	resetAll(): SettingsOptions {
		this.store.clear();
		this.store.set(defaultSettings);
		const settings = this.getAll();
		this.applySideEffects(settings);
		this.emitChange(settings);
		return settings;
	}

	migrate(values: Partial<SettingsOptions>): SettingsOptions {
		for (const key of Object.keys(defaultSettings) as SettingsKey[]) {
			const hasDurableUserValue =
				this.keysPresentBeforeDefaults.has(key) &&
				this.store.get(key) !== defaultSettings[key];
			if (hasDurableUserValue) continue;
			if (!(key in values)) continue;
			this.store.set(key, validateSetting(key, values[key]));
		}

		const settings = this.getAll();
		this.applySideEffects(settings);
		this.emitChange(settings);
		return settings;
	}

	getDownloadDirectory() {
		return this.get("downloadDirectory") ?? undefined;
	}

	private ensureDefaults() {
		for (const key of Object.keys(defaultSettings) as SettingsKey[]) {
			if (!this.store.has(key)) {
				this.store.set(key, defaultSettings[key]);
			} else {
				this.store.set(key, validateSetting(key, this.store.get(key)));
			}
		}
	}

	private applySideEffects(settings: SettingsOptions) {
		nativeTheme.themeSource = settings.theme;
		themeStore.set(
			"theme",
			settings.theme === "system"
				? nativeTheme.shouldUseDarkColors
					? "dark"
					: "light"
				: settings.theme,
		);
	}

	private emitChange(settings: SettingsOptions) {
		for (const window of BrowserWindow.getAllWindows()) {
			window.webContents.send("settings:changed", settings);
		}
	}

	private registerIpcListeners(): void {
		ipcMain.handle("settings:getAll", () => this.getAll());

		ipcMain.handle("settings:get", (_, key: SettingsKey) => {
			return this.get(key);
		});

		ipcMain.handle(
			"settings:set",
			(_, key: SettingsKey, value: SettingsOptions[SettingsKey]) => {
				return this.set(key, value);
			},
		);

		ipcMain.handle("settings:reset", (_, key: SettingsKey) => {
			return this.reset(key);
		});

		ipcMain.handle("settings:resetAll", () => {
			return this.resetAll();
		});

		ipcMain.handle("settings:migrateLocalStorage", (_, values) => {
			return this.migrate(normalizeSettings(values));
		});

		ipcMain.handle("settings:chooseDownloadDirectory", async (event) => {
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

			return this.set("downloadDirectory", result.filePaths[0]);
		});
	}
}

export default SettingsService;
