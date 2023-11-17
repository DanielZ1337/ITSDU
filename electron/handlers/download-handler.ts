import {app, BrowserWindow, ipcMain, shell} from "electron";
import axios from "axios";
import {download} from "electron-dl";
import {AuthService} from "../services/itslearning/auth/auth-service.ts";
import {CreateScrapeWindow, getCookiesForDomain} from "../../electron/services/scrape/scraper.ts";
import {
    getResourceDownloadLink,
    getResourceLinkByElementID,
    ITSLEARNING_RESOURCE_URL
} from "../../electron/services/itslearning/resources/resources.ts";
import {VITE_DEV_SERVER_URL} from "../main.ts";
import {getFormattedCookies} from "../utils/cookies.ts";

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
    ipcMain.handle('get-resource-download-link', async (_, elementId) => await getResourceLinkByElementID(elementId))
}

async function getBlobFromUrl() {
    ipcMain.handle('get-blob-from-element-id', async (_, elementId: string | number) => {
        const win = CreateScrapeWindow()
        const ssoLink = await getResourceLinkByElementID(elementId)
        await win.loadURL(ssoLink)
        const cookies = await getCookiesForDomain(win, ITSLEARNING_RESOURCE_URL)
        const cookiesFormatted = getFormattedCookies(cookies)
        const resourceLink = await getResourceDownloadLink(ssoLink, win)

        const {data, headers} = await axios.get(resourceLink, {
            headers: {
                Cookie: cookiesFormatted,
            },
            responseType: 'arraybuffer'
        })

        return data
    })
}

function uploadDocumentForAI() {
    ipcMain.handle('uploadfile-for-ai', async (event, {url, elementId}: {
        url: string,
        elementId: string | number
    }) => {
        console.log('uploadfile-for-ai')

        // make a get request to localhost:3000/api/checkFile/[elementId] to check if the current file exists
        // if it does then return
        // else continue

        const baseUrl = VITE_DEV_SERVER_URL ? 'http://localhost:3000' : 'https://itsdu.danielz.dev'

        const res = await fetch(`${baseUrl}/api/checkFile/${elementId}`)
        if (res.status === 200) throw new Error('File already exists for AI')
        if (res.status !== 404) throw new Error('Could not check if file exists for AI')
        const win = BrowserWindow.fromWebContents(event.sender)

        if (!win) return

        console.log('Getting cookies for AI')

        const cookies = await getCookiesForDomain(win, ITSLEARNING_RESOURCE_URL)

        const cookiesFormatted = cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ')

        //send cookies to the server so that the server can download the file with the cookies
        const uploadRes = await axios.post(`${baseUrl}/api/uploadFile/${elementId}`, {
            cookies: cookiesFormatted,
            url
        })

        return uploadRes.status === 200

        /* console.log('Getting file for AI')

        // get the file as a file type
        const data = await getResourceAsFile(url, cookies)

        console.log('Got file for AI')
        console.log(data)

        // make a formdata and then a post request to localhost:3000/api/uploadFile
        const formData = new FormData()
        formData.append('file', new Blob([data.buffer]), data.name)
        formData.append('elementId', elementId)

        const uploadRes = await axios.post('http://itsdu.danielz.dev/api/uploadFile', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })

        if (!uploadRes.data.success) throw new Error('Could not upload file for AI')

        console.log('Uploaded file for AI') */

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
            const fileLink = await getResourceDownloadLink(url)
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
    uploadDocumentForAI()
    getBlobFromUrl()
}