import {app, ipcMain} from "electron";

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

function relaunchHandler(){
    ipcMain.handle('app:relaunch', () => {
        app.relaunch()
        app.quit()
    })
}

export default function appHandlerInitializer() {
    quitHandler()
    getVersionHandler()
    relaunchHandler()
}