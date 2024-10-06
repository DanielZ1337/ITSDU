import { BrowserWindow } from "electron";

const DEFAULT_WINDOW_SCRAPER_OPTIONS = {
	show: false,
	webPreferences: {
		nodeIntegration: true,
	},
} as Electron.BrowserWindowConstructorOptions;

export function createScrapeWindow(
	options?: Electron.BrowserWindowConstructorOptions,
) {
	return new BrowserWindow({
		...DEFAULT_WINDOW_SCRAPER_OPTIONS,
		...options,
	});
}

export function getCookiesForDomain(win: BrowserWindow, domain: string) {
	return win.webContents.session.cookies.get({ url: domain });
}

export function scrapePage(win: BrowserWindow, url: string) {
	return win.loadURL(url);
}
