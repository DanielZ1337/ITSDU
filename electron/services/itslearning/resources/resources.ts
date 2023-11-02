import {BrowserWindow, Cookie} from "electron";
import axios from "axios";
import {GET_ITSLEARNING_URL} from "../itslearning.ts";
import {CreateScrapeWindow} from "../../scrape/scraper.ts";

const ITSLEARNING_RESOURCE_SUBDOMAIN = 'resource'
export const ITSLEARNING_RESOURCE_URL = GET_ITSLEARNING_URL(ITSLEARNING_RESOURCE_SUBDOMAIN)
export const ITSLEARNING_RESOURCE_DOWNLOAD_URL = `${ITSLEARNING_RESOURCE_URL}/Proxy/DownloadRedirect.ashx`

export async function getResourceIdsBySSOLink(win: BrowserWindow, url: string) {
    await win.loadURL(url)
    const iframeSrc = await win.webContents.executeJavaScript(`document.querySelectorAll('iframe')[1].src`)
    await win.loadURL(iframeSrc)
    const downloadHref = await win.webContents.executeJavaScript(`document.querySelector('#aspnetForm').action`)

    const regex = /LearningObjectId=([0-9]*)&LearningObjectInstanceId=([0-9]*)/gm;
    const matches = regex.exec(downloadHref)

    if (!matches) throw new Error('Could not find LearningObjectId and LearningObjectInstanceId')

    const LearningObjectId = matches[1]
    const LearningObjectInstanceId = matches[2]

    return {LearningObjectId, LearningObjectInstanceId}
}

export const getResourceFileLinkByIds = (LearningObjectId: string | number, LearningObjectInstanceId: string | number) => {
    const url = new URL(ITSLEARNING_RESOURCE_DOWNLOAD_URL)

    url.searchParams.append('LearningObjectId', LearningObjectId.toString())
    url.searchParams.append('LearningObjectInstanceId', LearningObjectInstanceId.toString())

    return url.toString()
}

export async function getResourceDownloadLink(url: string) {
    const win = CreateScrapeWindow()
    const {LearningObjectId, LearningObjectInstanceId} = await getResourceIdsBySSOLink(win, url);
    win.close()
    return getResourceFileLinkByIds(LearningObjectId, LearningObjectInstanceId);
}

export async function getResourceAsFile(url: string, cookies: Cookie[]) {
    // fetch url with cookies
    const {data, headers} = await axios.get(url, {
        headers: {
            Cookie: cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; '),
        },
        responseType: 'arraybuffer'
    })

    // get filename from headers
    const contentDisposition = headers['content-disposition']
    const filenameMatch = contentDisposition && contentDisposition.match(/filename="([^"]+)"/)
    const filename = filenameMatch ? decodeURIComponent(filenameMatch[1]) : 'unknown'

    // turn it into a file type
    const buffer = Buffer.from(data)
    const file = {
        buffer,
        size: buffer.length,
        name: filename,
        type: headers['content-type']
    }

    return file
}