import { app, autoUpdater, BrowserWindow, ipcMain } from "electron";

function exitHandler() {
    ipcMain.handle('app:exit', () => {
        app.exit(0)
    })
}

function quitHandler() {
    ipcMain.handle('app:quit', () => {
        app.quit()
    })
}

function getVersionHandler() {
    ipcMain.handle('app:getVersion', () => {
        return app.getVersion()
    })
}

function relaunchHandler() {
    ipcMain.handle('app:relaunch', () => {
        app.relaunch()
        app.quit()
    })
}

function MinimizerHandler() {
    ipcMain.handle('app:minimize', () => {
        const windows = BrowserWindow.getAllWindows()
        windows.forEach(window => {
            window.minimize()
        })
    })
}

function MaximizerHandler() {
    ipcMain.handle('app:maximize', () => {
        const focusedWindow = BrowserWindow.getFocusedWindow()
        if (focusedWindow) {
            if (focusedWindow.isMaximized()) {
                focusedWindow.unmaximize()
            } else {
                focusedWindow.maximize()
            }
        }
    })
}

function checkForUpdatesHandler() {
    ipcMain.handle('app:checkForUpdates', () => {
        autoUpdater.checkForUpdates()
    })
}

export default function appHandlerInitializer() {
    exitHandler()
    quitHandler()
    getVersionHandler()
    relaunchHandler()
    MinimizerHandler()
    MaximizerHandler()
    checkForUpdatesHandler()
}