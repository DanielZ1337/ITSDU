import { BrowserWindow, Cookie } from "electron";
import axios from "axios";
import { GET_ITSLEARNING_URL, ITSLEARNING_URL } from "../itslearning.ts";
import { createScrapeWindow } from "../../scrape/scraper.ts";
import { apiUrl } from "../../../../src/lib/utils.ts";
import { AuthService } from "../auth/auth-service.ts";
import { getFormattedCookies } from "../../../utils/cookies.ts";

const ITSLEARNING_RESOURCE_SUBDOMAIN = 'resource'
export const ITSLEARNING_RESOURCE_URL = GET_ITSLEARNING_URL(ITSLEARNING_RESOURCE_SUBDOMAIN)
export const ITSLEARNING_RESOURCE_DOWNLOAD_URL = new URL('/Proxy/DownloadRedirect.ashx', ITSLEARNING_RESOURCE_URL).toString()
export const GET_ITSLEARNING_ELEMENT_URL = (elementId: string) => new URL(`/LearningToolElement/ViewLearningToolElement.aspx?LearningToolElementId=${elementId}`, ITSLEARNING_URL()).toString()

export async function getResourceIdsBySSOLink(win: BrowserWindow, url: string) {
    await win.loadURL(url)
    const iframeSrc = await win.webContents.executeJavaScript(`document.querySelectorAll('iframe')[1].src`)
    await win.loadURL(iframeSrc)
    const downloadHref = await win.webContents.executeJavaScript(`document.querySelector('#aspnetForm').action`)

    const regex = /LearningObjectId=(\d*)&LearningObjectInstanceId=(\d*)/gm;
    const matches = regex.exec(downloadHref)

    if (!matches) throw new Error('Could not find LearningObjectId and LearningObjectInstanceId')

    const LearningObjectId = matches[1]
    const LearningObjectInstanceId = matches[2]

    return { LearningObjectId, LearningObjectInstanceId }
}

export function getResourceFileLinkByIds(LearningObjectId: string | number, LearningObjectInstanceId: string | number) {
    const url = new URL(ITSLEARNING_RESOURCE_DOWNLOAD_URL)

    url.searchParams.append('LearningObjectId', LearningObjectId.toString())
    url.searchParams.append('LearningObjectInstanceId', LearningObjectInstanceId.toString())

    return url.toString()
}

export async function getResourceDownloadLink(url: string, customWin?: BrowserWindow) {
    const win = customWin || createScrapeWindow()
    const { LearningObjectId, LearningObjectInstanceId } = await getResourceIdsBySSOLink(win, url);
    win.close()
    return getResourceFileLinkByIds(LearningObjectId, LearningObjectInstanceId);
}

export async function getMicrosoftOfficeDocumentAccessTokenAndUrl(url: string, customWin?: BrowserWindow) {
    const win = customWin || createScrapeWindow({
        show: false,
        webPreferences: {
            nodeIntegration: true,
            javascript: false,
        }
    })
    await win.loadURL(url)
    // document.getElementById('ctl00_ContentPlaceHolder_ExtensionIframe')
    const iframeSrc = await win.webContents.executeJavaScript(`document.querySelectorAll('iframe')[1].src`)
    await win.loadURL(iframeSrc)
    // document.getElementById('ctl00_ctl00_MainFormContent_PreviewIframe_FilePreviewIframe')
    const previewIframeSrc = await win.webContents.executeJavaScript(`document.querySelector('iframe').src`)
    await win.loadURL(previewIframeSrc)
    const accessToken = await win.webContents.executeJavaScript(`document.querySelector('input[name="access_token"]').value`)
    const downloadUrl = await win.webContents.executeJavaScript(`document.querySelectorAll('form')[1].action`)
    win.close()
    if (!accessToken || !downloadUrl) throw new Error('Could not get microsoft office document')
    return { accessToken, downloadUrl }
}

export async function getResourceAsFile(url: string, cookies: Cookie[]) {
    // fetch url with cookies
    const cookiesFormatted = getFormattedCookies(cookies)
    const { data, headers } = await axios.get(url, {
        headers: {
            Cookie: cookiesFormatted,
        },
        responseType: 'arraybuffer'
    })

    // get filename from headers
    const contentDisposition = headers['content-disposition']
    const filenameMatch = contentDisposition && contentDisposition.match(/filename="([^"]+)"/)
    const filename = filenameMatch ? decodeURIComponent(filenameMatch[1]) : 'unknown'
    const fileType = headers['content-type'] as string

    // turn it into a file type
    const arrayBuffer = Buffer.from(data)
    const file = {
        arrayBuffer: arrayBuffer,
        size: arrayBuffer.length,
        name: filename,
        type: fileType,
    }

    return file
}

export async function getResourceLinkByElementID(elementId: string | number) {
    const ssoLink = await getSSOLink(GET_ITSLEARNING_ELEMENT_URL(elementId.toString()))

    if (!ssoLink) throw new Error('Could not get resource link')

    return ssoLink
}

export async function getSSOLink(url: string) {
    const authService = AuthService.getInstance()
    const { data } = await axios.get(apiUrl(`restapi/personal/sso/url/v1`), {
        params: {
            'access_token': authService.getToken('access_token'),
            'url': url
        }
    })

    if (!data.Url) throw new Error('Could not get resource link')

    return data.Url
}	