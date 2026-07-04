import axios from "axios";
import { BrowserWindow, ipcMain } from "electron";
import { createAuthWindow } from "../../electron/main.ts";
import type { AuthRefreshOptions } from "../../src/types/auth.ts";
import {
	AuthRefreshError,
	AuthService,
} from "../services/itslearning/auth/auth-service.ts";
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
		if (val !== "access_token") return null;
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
	ipcMain.handle(
		"itslearning-store:refresh",
		async (_, options?: AuthRefreshOptions) => {
			try {
				return await authService.refreshAccessToken();
			} catch (error) {
				if (authService.getSessionStatus().state === "reauthRequired") {
					await createAuthWindow({ destroyExistingWindows: false });
				}
				if (options?.throwOnFailure) {
					if (error instanceof AuthRefreshError) {
						throw new Error(error.reason);
					}
					throw error;
				}
				return authService.getSessionStatus();
			}
		},
	);
}

function authStatusHandler() {
	ipcMain.handle("itslearning-store:getStatus", () => {
		return authService.getSessionStatus();
	});

	ipcMain.handle(
		"itslearning-store:setOnlineStatus",
		(_, isOnline: boolean) => {
			authService.setOnlineStatus(isOnline);
			return authService.getSessionStatus();
		},
	);
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
	authStatusHandler();
	getTokenHandler();
	setTokenHandler();
	deleteTokenHandler();
	clearTokensHandler();
	refreshTokensHandler();
	getCookies();
	logoutHandler();
}
