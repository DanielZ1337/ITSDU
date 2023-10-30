import {ipcMain, nativeTheme} from "electron";
import {themeStore} from "../services/theme/theme-service";

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