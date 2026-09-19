import { BrowserWindow, app } from "electron";
import { autoUpdater } from "electron-updater";
import { handle } from "../ipc/secure";

function exitHandler() {
	handle("app:exit", () => {
		app.exit(0);
	});
}

function quitHandler() {
	handle("app:quit", () => {
		app.quit();
	});
}

function getVersionHandler() {
	handle("app:getVersion", () => {
		return app.getVersion();
	});
}

function relaunchHandler() {
	handle("app:relaunch", () => {
		app.relaunch();
		app.quit();
	});
}

function MinimizerHandler() {
	handle("app:minimize", () => {
		const windows = BrowserWindow.getAllWindows();
		windows.forEach((window) => {
			window.minimize();
		});
	});
}

function MaximizerHandler() {
	handle("app:maximize", () => {
		const focusedWindow = BrowserWindow.getFocusedWindow();
		if (focusedWindow) {
			if (focusedWindow.isMaximized()) {
				focusedWindow.unmaximize();
			} else {
				focusedWindow.maximize();
			}
		}
	});
}

function checkForUpdatesHandler() {
	handle("app:checkForUpdates", async (_event) => {
		return (await autoUpdater.checkForUpdates())?.updateInfo;
	});
}

function downloadUpdateHandler() {
	handle("app:downloadUpdate", async (event) => {
		autoUpdater.on("download-progress", (progress) => {
			event.sender.send("app:downloadProgress", progress);
		});

		autoUpdater.on("update-downloaded", (info) => {
			event.sender.send("app:updateDownloaded", info);
		});

		return autoUpdater.downloadUpdate();
	});
}

function updateHandler() {
	handle("app:update", async (_event) => {
		return autoUpdater.quitAndInstall();
	});
}

function focusHandler() {
	handle("app:focus", () => {
		const window = BrowserWindow.getAllWindows()[0];

		if (window) {
			window.focus();
			window.show();
		}
	});
}

export default function appHandlerInitializer() {
	exitHandler();
	quitHandler();
	getVersionHandler();
	relaunchHandler();
	MinimizerHandler();
	MaximizerHandler();
	checkForUpdatesHandler();
	downloadUpdateHandler();
	updateHandler();
	focusHandler();
}
