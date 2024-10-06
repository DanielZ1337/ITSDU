import axios from "axios";
import { BrowserWindow, ipcMain } from "electron";
import { createAuthWindow } from "../../electron/main.ts";
import { AuthService } from "../services/itslearning/auth/auth-service.ts";
import { StoreKey } from "../services/itslearning/auth/types/store_keys.ts";
import {
	ITSLEARNING_RESOURCE_URL,
	getResourceLinkByElementID,
} from "../services/itslearning/resources/resources.ts";
import {
	createScrapeWindow,
	getCookiesForDomain,
} from "../services/scrape/scraper";
import { getFormattedCookies } from "../utils/cookies.ts";

const authService = AuthService.getInstance();

function getTokenHandler() {
	ipcMain.handle("itslearning-store:get", (_, val: StoreKey) => {
		return authService.getToken(val);
	});
}

function setTokenHandler() {
	ipcMain.handle("itslearning-store:set", (_, key: StoreKey, val) => {
		authService.setToken(key, val);
	});
}

function deleteTokenHandler() {
	ipcMain.handle("itslearning-store:delete", (_, key: StoreKey) => {
		authService.deleteToken(key);
	});
}

function clearTokensHandler() {
	ipcMain.handle("itslearning-store:clear", () => {
		authService.clearTokens();
	});
}

function refreshTokensHandler() {
	ipcMain.handle("itslearning-store:refresh", async () => {
		try {
			await authService.refreshAccessToken();
		} catch (error) {
			console.error(error);
		}
	});
}

function getCookies() {
	ipcMain.handle(
		"itslearning-store:get-cookies-for-resource",
		async (_, elementId) => {
			try {
				const win = createScrapeWindow();
				const ssoLink = await getResourceLinkByElementID(elementId);
				await win.loadURL(ssoLink);
				const cookies = await getCookiesForDomain(
					win,
					ITSLEARNING_RESOURCE_URL,
				);
				const cookiesFormatted = getFormattedCookies(cookies);
				return cookiesFormatted;
			} catch (e) {
				console.error(e);
				return null;
			}
		},
	);
}

function logoutHandler() {
	ipcMain.handle("itslearning-store:logout", async () => {
		authService.clearTokens();
		const wins = BrowserWindow.getAllWindows();
		const newWin = await createAuthWindow();
		if (wins.length > 0) {
			wins.forEach((win) => win.destroy());
		}
		newWin.setTitle("itslearning - Sign in");
	});
}

function scrapePageHandler() {
	ipcMain.handle("scrape-page", async (_, url) => {
		try {
			const response = await axios.get(url, {
				headers: {
					responseType: "text",
					"User-Agent":
						"Mozilla/5.0 (compatible; Googlebot/2.1; https://www.google.com/bot.html)",
				},
				timeout: 1000,
			});

			const { data, status, statusText } = response;

			return { data, status, statusText };
		} catch (error) {
			console.error(error);
			return null;
		}
	});
}

export default function initAuthIpcHandlers() {
	scrapePageHandler();
	getTokenHandler();
	setTokenHandler();
	deleteTokenHandler();
	clearTokensHandler();
	refreshTokensHandler();
	getCookies();
	logoutHandler();
}
