import {nativeTheme} from "electron";

const Store = require('electron-store');


interface ThemeStore {
    theme: 'light' | 'dark'
}

// @ts-ignore - gives a wrong type error
export const themeStore = new Store<ThemeStore>({
    name: 'itslearning-theme-store',
    defaults: {
        theme: nativeTheme.shouldUseDarkColors ? 'dark' : 'light'
    }
})