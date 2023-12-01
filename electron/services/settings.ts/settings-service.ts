const Store = require('electron-store');
const { ipcMain } = require('electron');

type SettingKey = 'theme' | 'language' | 'fontSize';

class SettingsService {
    private static instance: SettingsService;
    private store: typeof Store;

    private constructor() {
        this.store = new Store();
        this.registerIpcListeners();
    }

    static getInstance(): SettingsService {
        if (!SettingsService.instance) {
            SettingsService.instance = new SettingsService();
        }
        return SettingsService.instance;
    }

    get<T>(key: SettingKey): T | undefined {
        return this.store.get(key);
    }

    set<T>(key: SettingKey, value: T): void {
        this.store.set(key, value);
    }

    delete(key: SettingKey): void {
        this.store.delete(key);
    }

    clear(): void {
        this.store.clear();
    }

    has(key: SettingKey): boolean {
        return this.store.has(key);
    }

    private registerIpcListeners(): void {
        ipcMain.handle('get-setting', (_, key) => {
            const value = this.get(key);
            return value
        });

        ipcMain.handle('set-setting', (_, key, value) => {
            this.set(key, value);
        });

        ipcMain.handle('delete-setting', (_, key) => {
            this.delete(key);
        });

        ipcMain.handle('clear-settings', () => {
            this.clear();
        });

        ipcMain.handle('has-setting', (_, key) => {
            const hasSetting = this.has(key);
            return hasSetting;
        });
    }
}

export default SettingsService;