import { nativeTheme } from "electron";
import Store from "electron-store";

interface ThemeStore {
    theme: 'light' | 'dark'
}

export const themeStore = new Store<ThemeStore>({
    name: 'itslearning-theme-store',
    defaults: {
        theme: nativeTheme.shouldUseDarkColors ? 'dark' : 'light'
    }
})