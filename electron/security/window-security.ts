import { type BrowserWindow, type Session, app, session, shell } from "electron";
import path from "node:path";
import { pathToFileURL } from "node:url";

export const WEBVIEW_PARTITION = "persist:itsdu-webview";

const ALLOWED_PERMISSIONS = new Set([
	"clipboard-sanitized-write",
	"fullscreen",
	"notifications",
	"pointerLock",
]);

/** Deny every permission request except the few the app actually needs. */
export function restrictPermissions(target: Session) {
	target.setPermissionRequestHandler((_wc, permission, callback) =>
		callback(ALLOWED_PERMISSIONS.has(permission)),
	);
	target.setPermissionCheckHandler((_wc, permission) =>
		ALLOWED_PERMISSIONS.has(permission),
	);
}

function isAppUrl(url: string): boolean {
	try {
		const parsed = new URL(url);
		const dev = process.env.VITE_DEV_SERVER_URL;
		if (dev && parsed.origin === new URL(dev).origin) return true;
		return (
			parsed.protocol === "file:" &&
			parsed.href.startsWith(pathToFileURL(path.resolve(process.env.DIST) + path.sep).href)
		);
	} catch {
		return false;
	}
}

/** App windows may only navigate within the app; web links go to the default browser. */
export function lockNavigation(win: BrowserWindow) {
	win.webContents.on("will-navigate", (event, url) => {
		if (isAppUrl(url)) return;
		event.preventDefault();
		if (/^https?:/i.test(url)) void shell.openExternal(url);
	});
}

/** Harden <webview> guests: no preload, no node, sandboxed, isolated session, https only. */
export function hardenWebviews() {
	app.on("web-contents-created", (_event, contents) => {
		contents.on("will-attach-webview", (event, webPreferences, params) => {
			delete (webPreferences as { preload?: string }).preload;
			webPreferences.nodeIntegration = false;
			webPreferences.contextIsolation = true;
			webPreferences.sandbox = true;
			webPreferences.webSecurity = true;
			params.partition = WEBVIEW_PARTITION;
			delete params.allowpopups;
			let ok = false;
			try {
				ok = new URL(params.src).protocol === "https:";
			} catch {
				ok = false;
			}
			if (!ok) event.preventDefault();
		});
	});
	restrictPermissions(session.fromPartition(WEBVIEW_PARTITION));
}
