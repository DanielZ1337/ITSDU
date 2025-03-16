import { BrowserWindow, app, ipcMain } from "electron";
import { autoUpdater } from "electron-updater";

function exitHandler() {
	ipcMain.handle("app:exit", () => {
		app.exit(0);
	});
}

function quitHandler() {
	ipcMain.handle("app:quit", () => {
		app.quit();
	});
}

function getVersionHandler() {
	ipcMain.handle("app:getVersion", () => {
		return app.getVersion();
	});
}

function relaunchHandler() {
	ipcMain.handle("app:relaunch", () => {
		app.relaunch();
		app.quit();
	});
}

function MinimizerHandler() {
	ipcMain.handle("app:minimize", () => {
		const windows = BrowserWindow.getAllWindows();
		windows.forEach((window) => {
			window.minimize();
		});
	});
}

function MaximizerHandler() {
	ipcMain.handle("app:maximize", () => {
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
	ipcMain.handle("app:checkForUpdates", async (event) => {
		return (await autoUpdater.checkForUpdates())?.updateInfo;
	});
}

function downloadUpdateHandler() {
	ipcMain.handle("app:downloadUpdate", async (event) => {
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
	ipcMain.handle("app:update", async (event) => {
		return autoUpdater.quitAndInstall();
	});
}

function focusHandler() {
	ipcMain.handle("app:focus", () => {
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
