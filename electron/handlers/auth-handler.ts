import { BrowserWindow, ipcMain } from "electron";
import { AuthService } from "../services/itslearning/auth/auth-service.ts";
import { store_keys } from '../services/itslearning/auth/types/store_keys.ts';
import { CreateScrapeWindow, getCookiesForDomain } from '../services/scrape/scraper';
import { getResourceLinkByElementID, ITSLEARNING_RESOURCE_URL } from "../services/itslearning/resources/resources.ts";
import { getFormattedCookies } from "../utils/cookies.ts";
import { createAuthWindow } from "../../electron/main.ts";

const authService = AuthService.getInstance()

function getTokenHandler() {
    ipcMain.handle('itslearning-store:get', (event, val: store_keys) => {
        return authService.getToken(val)
    });
}

function setTokenHandler() {
    ipcMain.handle('itslearning-store:set', (event, key: store_keys, val) => {
        authService.setToken(key, val)
    });
}

function deleteTokenHandler() {
    ipcMain.handle('itslearning-store:delete', (event, key: store_keys) => {
        authService.deleteToken(key)
    })
}

function clearTokensHandler() {
    ipcMain.handle('itslearning-store:clear', (event) => {
        authService.clearTokens()
    });
}

function getCookies() {
    ipcMain.handle('itslearning-store:get-cookies-for-resource', async (event, elementId) => {
        try {
            const win = CreateScrapeWindow()
            const ssoLink = await getResourceLinkByElementID(elementId)
            await win.loadURL(ssoLink)
            const cookies = await getCookiesForDomain(win, ITSLEARNING_RESOURCE_URL)
            const cookiesFormatted = getFormattedCookies(cookies)
            return cookiesFormatted
        } catch (e) {
            console.error(e)
            return null
        }
    });
}

function logoutHandler() {
    ipcMain.handle('itslearning-store:logout', async () => {
        authService.clearTokens()
        const wins = BrowserWindow.getAllWindows()
        const newWin = await createAuthWindow()
        wins.forEach(win => win.destroy())
        newWin.setTitle('itslearning - Sign in')
    });
}

export default function initAuthIpcHandlers() {
    getTokenHandler()
    setTokenHandler()
    deleteTokenHandler()
    clearTokensHandler()
    getCookies()
    logoutHandler()
}