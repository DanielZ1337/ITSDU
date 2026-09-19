import { type BrowserWindow, type IpcMainInvokeEvent, type WebContents, ipcMain } from "electron";
import path from "node:path";
import { pathToFileURL } from "node:url";

/** Web contents of the app's own windows (main + login). Guests, hidden scrape windows and popups are never in here. */
const trustedContents = new WeakSet<WebContents>();

export function registerTrustedWindow(win: BrowserWindow) {
	trustedContents.add(win.webContents);
}

function isAppUrl(value: string): boolean {
	let url: URL;
	try {
		url = new URL(value);
	} catch {
		return false;
	}
	const devUrl = process.env.VITE_DEV_SERVER_URL;
	if (devUrl && url.origin === new URL(devUrl).origin) return true;
	if (url.protocol !== "file:") return false;
	const distRoot = pathToFileURL(path.resolve(process.env.DIST) + path.sep).href;
	return url.href.startsWith(distRoot);
}

/**
 * True when the IPC message comes from the top frame of one of the app's own windows. The frame may be null
 * (or not yet committed) for messages sent by preload scripts during page start, so the window identity is the
 * primary check and the URL is only checked when it is known.
 */
export function isTrustedSender(event: IpcMainInvokeEvent): boolean {
	if (!trustedContents.has(event.sender)) return false;
	const frame = event.senderFrame;
	if (frame && frame !== event.sender.mainFrame) return false;
	const url = frame?.url || event.sender.getURL();
	return url === "" || isAppUrl(url);
}

/** `ipcMain.handle` that refuses messages from untrusted senders. */
export function handle(
	channel: string,
	listener: (event: IpcMainInvokeEvent, ...args: any[]) => unknown,
): void {
	ipcMain.removeHandler(channel);
	ipcMain.handle(channel, (event, ...args) => {
		if (!isTrustedSender(event)) {
			console.warn(`[ipc] rejected "${channel}" from untrusted sender ${event.senderFrame?.url}`);
			throw new Error(`Untrusted IPC sender for ${channel}`);
		}
		return listener(event, ...args);
	});
}
