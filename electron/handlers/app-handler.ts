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

export default function appHandlerInitializer() {
    quitHandler()
    getVersionHandler()
}