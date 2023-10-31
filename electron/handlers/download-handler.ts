import {app, BrowserWindow, ipcMain, shell} from "electron";
import axios from "axios";
import {apiUrl} from "../../src/lib/utils.ts";
import {download} from "electron-dl";
import {AuthService} from "../services/auth/auth-service.ts";

const authService = AuthService.getInstance()

function openExternalHandler() {
    ipcMain.handle('app:openExternal', async (_, url, sso) => {
        // open the url with the default browser and get sso url
        if (sso) {
            const {data} = await axios.get(`https://sdu.itslearning.com/restapi/personal/sso/url/v1?url=${url}`, {
                params: {
                    'access_token': authService.getToken('access_token'),
                }
            })
            url = data.Url
        }

        // open the url with the default browser
        await shell.openExternal(url)
    })
}

function getPathHandler() {
    ipcMain.handle('app:getPath', async (_, path) => {
        return app.getPath(path)
    })

    ipcMain.handle('app:getDownloadPath', async () => {
        console.log(app.getPath('downloads'))
        return app.getPath('downloads')
    })
}

function openShellHandler() {
    ipcMain.handle('app:openShell', async (_, path) => {
        console.log(path)
        await shell.openPath(path)
    })
}

function openItemHandler() {
    ipcMain.handle('app:openItem', async (_, path) => {
        console.log(path)
        await shell.openPath(path)
    })
}

function getResourceDownloadLinkForElementId() {
    ipcMain.handle('get-resource-download-link', async (_, elementId) => {
        const {data} = await axios.get(apiUrl(`restapi/personal/sso/url/v1`), {
            params: {
                'access_token': authService.getToken('access_token'),
                'url': `https://sdu.itslearning.com/LearningToolElement/ViewLearningToolElement.aspx?LearningToolElementId=${elementId}`
            }
        })

        return data.Url
    })
}

function itslearningElementDownload() {
    ipcMain.handle("itslearning-element:download", async (event, {url, resourceLink, filename}) => {
        try { /*const win = BrowserWindow.fromWebContents(event.sender)
        if (!win) return*/

            console.log(url, resourceLink, filename)
            const win = BrowserWindow.fromWebContents(event.sender)

            if (!win) return
            // await newWin.loadURL(resourceLink)
            console.log('download# ' + url)

            // download the file
            const downloadItem = await download(win, url, {
                // directory: app.getPath('downloads'),
                showProgressBar: true,
                showBadge: true,
                onProgress(progress) {
                    if (progress.totalBytes) {
                        const percent = Math.floor(
                            (progress.transferredBytes / progress.totalBytes) * 100
                        );
                        console.log(`Downloaded ${percent}%`);
                    }
                },
            })
            // logEverywhere('download# ' + downloadItem.getSavePath())
            event.sender.send("download:complete", downloadItem.getSavePath())
        } catch (e) {
            console.error(e)
            event.sender.send("download:error", null)
        }
    })
}

function downloadExternalHandler() {
    ipcMain.handle("download:external", async (event, {url, filename}) => {
        try {
            console.log(url, filename)

            const win = BrowserWindow.fromWebContents(event.sender)

            if (!win) return

            // download the file
            const downloadItem = await download(win, url, {
                // directory: app.getPath('downloads'),
                showProgressBar: true,
                showBadge: true,
            })
            event.sender.send("download:complete", downloadItem.getSavePath())
        } catch (e) {
            console.error(e)
            event.sender.send("download:error", null)
        }
    })
}


function downloadStartHandler() {
    ipcMain.handle("download:start", async (_, url) => {
        try {
            const scrapeWindow = new BrowserWindow({
                show: false,
                webPreferences: {
                    nodeIntegration: true,
                }
            })
            await scrapeWindow.loadURL(url)

            const iframeSrc = await scrapeWindow.webContents.executeJavaScript(`document.querySelectorAll('iframe')[1].src`)
            await scrapeWindow.loadURL(iframeSrc)
            // const downloadHref = await scrapeWindow.webContents.executeJavaScript(`document.querySelector('#ctl00_ctl00_MainFormContent_DownloadLinkForViewType').getAttribute('href')`)
            // const fileLink = 'https://resource.itslearning.com' + downloadHref
            //document.querySelector('#aspnetForm').action
            const downloadHref = await scrapeWindow.webContents.executeJavaScript(`document.querySelector('#aspnetForm').action`)
            // get LearningObjectId and LearningObjectInstanceId from the action url
            const regex = /LearningObjectId=([0-9]*)&LearningObjectInstanceId=([0-9]*)/gm;
            const matches = regex.exec(downloadHref)
            if (!matches) throw new Error('Could not find LearningObjectId and LearningObjectInstanceId')
            const LearningObjectId = matches[1]
            console.log(LearningObjectId)
            const LearningObjectInstanceId = matches[2]
            console.log(LearningObjectInstanceId)
            // https://resource.itslearning.com/Proxy/DownloadRedirect.ashx?LearningObjectId=365284744&LearningObjectInstanceId=510275481
            const fileLink = `https://resource.itslearning.com/Proxy/DownloadRedirect.ashx?LearningObjectId=${LearningObjectId}&LearningObjectInstanceId=${LearningObjectInstanceId}`
            scrapeWindow.close()
            return fileLink
        } catch (e) {
            console.error(e)
            return null
        }
    })
}

export default function initDownloadHandlers() {
    openExternalHandler()
    getPathHandler()
    openShellHandler()
    openItemHandler()
    getResourceDownloadLinkForElementId()
    itslearningElementDownload()
    downloadExternalHandler()
    downloadStartHandler()
}