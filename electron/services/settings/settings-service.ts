const Store = require('electron-store');
const { ipcMain } = require('electron');

type SettingsOptions = {
    CustomPDFrenderer: boolean;
    CustomTitleBar: boolean;
    CustomTitleBarButtons: boolean;
    UploadAIChats: boolean;
    DefaultAIChatSidepanel: boolean;
    // theme: string;
    // language: string;
}

const defaultSettings: SettingsOptions = {
    'CustomPDFrenderer': true,
    'CustomTitleBar': true,
    'CustomTitleBarButtons': true,
    'UploadAIChats': true,
    'DefaultAIChatSidepanel': true,
}

export class SettingsService {
    private static instance: SettingsService;
    private store: typeof Store;

    private constructor() {
        this.store = new Store({
            watch: true,
            name: 'itsdu-settings',
            defaults: {
                // theme: 'dark',
                // language: 'en',
                CustomPDFrenderer: true,
                CustomTitleBar: true,
                CustomTitleBarButtons: true,
            },
        });
        this.registerIpcListeners();
    }

    static getInstance(): SettingsService {
        if (!SettingsService.instance) {
            SettingsService.instance = new SettingsService();
        }
        return SettingsService.instance;
    }

    getKeys(): string[] {
        const allValues = this.store.store;
        const keys = Object.keys(allValues);
        return keys;
    }

    getAll(): SettingsOptions {
        return this.store.store;
    }

    getDefaults(): SettingsOptions {
        return this.store.defaults;
    }

    get<T extends keyof SettingsOptions>(keys: T[]): Partial<SettingsOptions> {
        const result: Partial<SettingsOptions> = {};

        for (const key of keys) {
            result[key] = this.store.get(key);
        }

        return result;
    }

    set<K extends keyof SettingsOptions>(key: K, value: SettingsOptions[K]): void {
        this.store.set(key, value);
    }

    delete(key: keyof SettingsOptions): void {
        this.store.delete(key);
    }

    clear(): void {
        this.store.clear();
    }

    has(key: keyof SettingsOptions): boolean {
        return this.store.has(key);
    }

    private registerIpcListeners(): void {
        ipcMain.handle('settings:get', (_, keys) => {
            return this.get(keys);
        })

        ipcMain.on('settings:set', (_, key, value) => {
            this.set(key, value);
        })

        ipcMain.on('settings:delete', (_, key) => {
            this.delete(key);
        })

        ipcMain.on('settings:clear', () => {
            this.clear();
        })

        ipcMain.handle('settings:has', (_, key) => {
            return this.has(key);
        })

        ipcMain.handle('settings:getKeys', () => {
            return this.getKeys();
        })

        ipcMain.handle('settings:getDefaults', () => {
            return this.getDefaults();
        })

        ipcMain.handle('settings:getAll', () => {
            return this.getAll();
        })
    }
}

export default SettingsService;