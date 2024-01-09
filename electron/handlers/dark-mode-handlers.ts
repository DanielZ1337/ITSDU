import { ipcMain, nativeTheme } from "electron";
import { themeStore } from "../services/theme/theme-service";

function darkModeToggleHandler() {
    ipcMain.handle('dark-mode:toggle', () => {
        if (nativeTheme.shouldUseDarkColors) {
            nativeTheme.themeSource = 'light'
        } else {
            nativeTheme.themeSource = 'dark'
        }
        themeStore.set('theme', nativeTheme.shouldUseDarkColors ? 'dark' : 'light')
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
        //return nativeTheme.shouldUseDarkColors
        return themeStore.get('theme')
    })
}

function darkModeSetHandler() {
    ipcMain.handle('dark-mode:set', (_, value) => {
        nativeTheme.themeSource = value ? 'dark' : 'light'
        themeStore.set('theme', value ? 'dark' : 'light')
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
    darkModeSetHandler()
}


//     parent.appendChild(child)
//     },
//     remove(parent: HTMLElement, child: HTMLElement) {
//         parent.removeChild(child)
//     },
// }
//