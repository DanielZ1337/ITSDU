import {ipcMain, nativeTheme} from "electron";

function darkModeToogleHandler() {
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

export default function darkModeHandler() {
    darkModeToogleHandler()
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