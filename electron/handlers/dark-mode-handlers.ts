import { ipcMain, nativeTheme } from "electron";
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



function darkModeToggleHandler() {
    ipcMain.handle('dark-mode:toggle', () => {
        if (nativeTheme.shouldUseDarkColors) {
            nativeTheme.themeSource = 'light'
        } else {
            nativeTheme.themeSource = 'dark'
        }
        return nativeTheme.shouldUseDarkColors
    })
}

function darkModeSetSystemHandler() {
    ipcMain.handle('dark-mode:system', () => {
        nativeTheme.themeSource = 'system'
    })
}

function darkModeGetHandler() {
    ipcMain.handle('dark-mode:get', () => {
        return nativeTheme.shouldUseDarkColors
    })
}

function darkModeSubscribeHandle() {
    ipcMain.handle('dark-mode:subscribe', (event) => {
        nativeTheme.on('updated', () => {
            event.sender.send('dark-mode:updated', nativeTheme.shouldUseDarkColors)
        })
    })
}

export default function darkModeHandlerInitializer() {
    darkModeToggleHandler()
    darkModeSetSystemHandler()
    darkModeGetHandler()
    darkModeSubscribeHandle()
}


//     parent.appendChild(child)
//     },
//     remove(parent: HTMLElement, child: HTMLElement) {
//         parent.removeChild(child)
//     },
// }
//