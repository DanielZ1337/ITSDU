import type { AppUpdater } from "electron-updater";

let updater: Promise<AppUpdater> | undefined;

/** electron-updater (and its dependency tree) is loaded on first use, not during startup. */
export function getAutoUpdater(): Promise<AppUpdater> {
	updater ??= import("electron-updater").then(({ autoUpdater }) => {
		autoUpdater.autoRunAppAfterInstall = true;
		autoUpdater.autoInstallOnAppQuit = false;
		autoUpdater.autoDownload = false;
		return autoUpdater;
	});
	return updater;
}
