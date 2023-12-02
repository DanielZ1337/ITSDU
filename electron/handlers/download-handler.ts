import { app, BrowserWindow, ipcMain, shell } from "electron";
import axios from "axios";
import { download } from "electron-dl";
import { AuthService } from "../services/itslearning/auth/auth-service.ts";
import { CreateScrapeWindow, getCookiesForDomain as getCookiesFromDomain } from "../../electron/services/scrape/scraper.ts";
import {
    getMicrosoftOfficeDocumentAccessTokenAndUrl,
    getResourceAsFile,
    getResourceDownloadLink,
    getResourceLinkByElementID,
    getSSOLink,
    ITSLEARNING_RESOURCE_URL
} from "../../electron/services/itslearning/resources/resources.ts";
import { VITE_DEV_SERVER_URL } from "../main.ts";
import { getFormattedCookies } from "../utils/cookies.ts";

const authService = AuthService.getInstance()

export async function openLinkInBrowser(url: string, sso: boolean = true) {
    if (sso) {
        const { data } = await axios.get(`https://sdu.itslearning.com/restapi/personal/sso/url/v1?url=${url}`, {
            params: {
                'access_token': authService.getToken('access_token'),
            }
        })
        url = data.Url
    }

    // open the url with the default browser
    await shell.openExternal(url)
}

function openExternalHandler() {
    ipcMain.handle('app:openExternal', async (_, url, sso) => {
        await openLinkInBrowser(url, sso)
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
        const cookies = await getCookiesFromDomain(win, ITSLEARNING_RESOURCE_URL)
        const cookiesFormatted = getFormattedCookies(cookies)
        const resourceLink = await getResourceDownloadLink(ssoLink, win)

        const { data } = await axios.get(resourceLink, {
            headers: {
                Cookie: cookiesFormatted,
            },
            responseType: 'arraybuffer'
        })

        return data
    })
}

async function getResourceAsFileHandler() {
    ipcMain.handle('resources:get-file', async (_, elementId: string | number) => {
        const win = CreateScrapeWindow()
        const ssoLink = await getResourceLinkByElementID(elementId)
        await win.loadURL(ssoLink)
        const cookies = await getCookiesFromDomain(win, ITSLEARNING_RESOURCE_URL)
        const resourceLink = await getResourceDownloadLink(ssoLink, win)
        const resource = await getResourceAsFile(resourceLink, cookies)

        return resource
    })

}

async function getMicrosoftOfficeDocument() {
    ipcMain.handle('resources:get-office-document', async (_, elementId: string | number) => {
        try {
            const win = CreateScrapeWindow()
            const ssoLink = await getResourceLinkByElementID(elementId)
            await win.loadURL(ssoLink)
            const { downloadUrl, accessToken } = await getMicrosoftOfficeDocumentAccessTokenAndUrl(ssoLink)
            return { downloadUrl, accessToken }
        } catch (error) {
            console.error(error)
        }
    })
}

function uploadDocumentForAI() {
    ipcMain.handle('uploadfile-for-ai', async (event, { url, elementId }: {
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

        const cookies = await getCookiesFromDomain(win, ITSLEARNING_RESOURCE_URL)

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
    ipcMain.handle("itslearning-element:download", async (event, { url, resourceLink, filename }) => {
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
    ipcMain.handle("download:external", async (event, { url, filename }) => {
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

function getVideoLinkHandler() {
    ipcMain.handle("resources:get-media", async (_, elementId: string | number) => {
        try {
            const win = CreateScrapeWindow()
            const ssoLink = await getResourceLinkByElementID(elementId)
            await win.loadURL(ssoLink)
            const iframeSrc = await win.webContents.executeJavaScript(`document.querySelectorAll('iframe')[1].src`)
            await win.loadURL(iframeSrc)
            const videoIframeSrc = await win.webContents.executeJavaScript(`document.querySelector('iframe').src`)
            await win.loadURL(videoIframeSrc)
            const mediaLink = await win.webContents.executeJavaScript(`document.querySelector('body').querySelector('[src]').src`)
            win.close()
            return mediaLink
        } catch (e) {
            console.error(e)
            return null
        }
    })
}

function getCoursePlansHandler() {
    ipcMain.handle("resources:get-course-plans", async (_, courseId: string | number) => {
        try {
            const win = CreateScrapeWindow()
            //https://sdu.itslearning.com/Planner/Planner.aspx?CourseID=29221
            const payloadUrl = new URL(`https://sdu.itslearning.com/Planner/Planner.aspx`)
            payloadUrl.searchParams.append('CourseID', courseId.toString())
            payloadUrl.searchParams.append('Filter', '-1')
            const ssoLink = await getSSOLink(payloadUrl.toString())
            await win.loadURL(ssoLink)
            const body = await win.webContents.executeJavaScript(`document.querySelector('body').innerHTML`)
            win.close()

            const cheerio = await import('cheerio')

            // Assuming your HTML snippet is stored in a variable named 'htmlContent'
            const $ = cheerio.load(body)

            // Select all elements with class 'itsl-topic'
            const courses = $('.itsl-topic')

            const coursePlans: object[] = []

            // Loop through each course to extract information
            courses.each((_, element) => {
                const attributes = element.attribs; // Get all attributes as an object

                // Extract specific attributes
                const dataTopicId = attributes['data-topic-id'];
                const courseTitle = $(element).find('.itsl-topic-title span').text().trim();

                // Extract plans count
                const plansText = $(element).find('.itsl-topic-expander .itsl-topic-expanded-text').text().trim();
                const plansCount = parseInt(plansText.split(' ')[0]); // Extracting the numeric part

                // Extract and convert dates
                const datesText = $(element).find('.itsl-topic-expander .itsl-topic-dates').text().trim();
                // get the dates from the string "from 24-10-2023 to 31-10-2023"
                const dates = datesText.split(' ').slice(1, 4);
                const fromDateString = dates[0]
                const toDateString = dates[2]

                // Convert dates to Date objects using moment.js
                // dynamically import moment.js
                const moment = require('moment')

                const fromDate = moment(fromDateString, 'DD-MM-YYYY').toDate()

                const toDate = moment(toDateString, 'DD-MM-YYYY').toDate()

                console.log('-----------------------')
                console.log('toDate', dates[2])
                console.log('-----------------------')

                // Log extracted information
                console.log(`Course Title: ${courseTitle}`);
                console.log(`Data Topic ID: ${dataTopicId}`);
                console.log(`Plans Count: ${plansCount}`);
                console.log(`From Date: ${fromDate.toDateString()}`);
                console.log(`To Date: ${toDate.toDateString()}`);

                // Log all attributes
                console.log('Attributes:');
                Object.keys(attributes).forEach((attr) => {
                    console.log(`${attr}: ${attributes[attr]}`);
                });

                const coursePlan = {
                    dataTopicId,
                    courseTitle,
                    plansCount,
                    fromDate,
                    toDate,
                    attributes
                }

                coursePlans.push(coursePlan)

                console.log('-----------------------');
            });

            return coursePlans
        } catch (e) {
            console.error(e)
            return null
        }
    })
}

function streamFileHandler() {
    ipcMain.handle("resources:stream-start", async (event, elementId) => {
        try {
            const win = CreateScrapeWindow()
            const ssoLink = await getResourceLinkByElementID(elementId)
            await win.loadURL(ssoLink)
            const cookies = await getCookiesFromDomain(win, ITSLEARNING_RESOURCE_URL)
            const resourceLink = await getResourceDownloadLink(ssoLink, win)
            let downloaded = 0

            axios.get(resourceLink, {
                headers: {
                    Cookie: getFormattedCookies(cookies),
                },
                responseType: 'stream'
            }).then(res => {
                res.data.on('data', (data: ArrayBuffer) => {
                    downloaded += Buffer.byteLength(data)
                    console.log(downloaded)
                    event.sender.send('resources:stream-data', { total: res.headers['content-length'], loaded: downloaded })
                })
                res.data.on('end', () => {
                    // event.sender.send('downloadEnd')
                    // win.close()
                })
                res.data.on('error', (error: Error) => {
                    // event.sender.send('downloadError', error)
                })
            })

            return resourceLink
        } catch (e) {
            console.error(e)
            return null
        }
    })

}

export default function initDownloadHandlers() {
    getCoursePlansHandler()
    streamFileHandler()
    getVideoLinkHandler()
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
    getMicrosoftOfficeDocument()
    getResourceAsFileHandler()
}