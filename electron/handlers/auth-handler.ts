import axios from "axios";
import { BrowserWindow } from "electron";
import { createAuthWindow } from "../../electron/main.ts";
import type { AuthRefreshOptions } from "../../src/types/auth.ts";
import { handle } from "../ipc/secure";
import { assertPublicHttpUrl } from "../ipc/validators";
import {
	AuthRefreshError,
	AuthService,
} from "../services/itslearning/auth/auth-service.ts";
import { StoreKey } from "../services/itslearning/auth/types/store_keys.ts";
import {
	getResourceLinkByElementID,
	ITSLEARNING_RESOURCE_URL,
} from "../services/itslearning/resources/resources.ts";
import {
	createScrapeWindow,
	getCookiesForDomain,
} from "../services/scrape/scraper";
import { getFormattedCookies } from "../utils/cookies.ts";

const authService = AuthService.getInstance();

function getTokenHandler() {
	handle("itslearning-store:get", (_, val: StoreKey) => {
		if (val !== "access_token") return null;
		return authService.getToken(val);
	});
}

function clearTokensHandler() {
	handle("itslearning-store:clear", () => {
		authService.clearTokens();
	});
}

function refreshTokensHandler() {
	handle(
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
	handle("itslearning-store:getStatus", () => {
		return authService.getSessionStatus();
	});

	handle("itslearning-store:setOnlineStatus", (_, isOnline: boolean) => {
		authService.setOnlineStatus(isOnline);
		return authService.getSessionStatus();
	});
}

function getCookies() {
	handle("itslearning-store:get-cookies-for-resource", async (_, elementId) => {
		try {
			const win = createScrapeWindow();
			const ssoLink = await getResourceLinkByElementID(elementId);
			await win.loadURL(ssoLink);
			const cookies = await getCookiesForDomain(win, ITSLEARNING_RESOURCE_URL);
			const cookiesFormatted = getFormattedCookies(cookies);
			return cookiesFormatted;
		} catch (e) {
			console.error(e);
			return null;
		}
	});
}

function logoutHandler() {
	handle("itslearning-store:logout", async () => {
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
	handle("scrape-page", async (_, url) => {
		try {
			const safeUrl = assertPublicHttpUrl(url).href;
			const response = await axios.get(safeUrl, {
				headers: {
					responseType: "text",
					"User-Agent":
						"Mozilla/5.0 (compatible; Googlebot/2.1; https://www.google.com/bot.html)",
				},
				timeout: 3000,
				maxRedirects: 3,
				maxContentLength: 2 * 1024 * 1024,
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
	clearTokensHandler();
	refreshTokensHandler();
	getCookies();
	logoutHandler();
}
