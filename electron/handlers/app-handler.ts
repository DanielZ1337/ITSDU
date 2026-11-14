import { app, BrowserWindow } from "electron";
import { handle } from "../ipc/secure";
import { getAutoUpdater } from "../services/updater/updater";
import { reportTelemetry } from "../services/telemetry/telemetry";
import { DeviceService } from "../services/device/device-service";

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
		try {
			const info = (await (await getAutoUpdater()).checkForUpdates())?.updateInfo;
			void reportTelemetry("update_checked");
			if (info?.version && info.version !== app.getVersion()) void reportTelemetry("update_available");
			return info;
		} catch (error) {
			void reportTelemetry("update_check_failed");
			throw error;
		}
	});
}

function downloadUpdateHandler() {
	handle("app:downloadUpdate", async (event) => {
		void reportTelemetry("update_download_started");
		const autoUpdater = await getAutoUpdater();
		// Replace listeners from an earlier attempt so progress is not reported twice.
		autoUpdater.removeAllListeners("download-progress");
		autoUpdater.removeAllListeners("update-downloaded");

		autoUpdater.on("download-progress", (progress) => {
			event.sender.send("app:downloadProgress", progress);
		});

		autoUpdater.on("update-downloaded", (info) => {
			event.sender.send("app:updateDownloaded", info);
		});

		try {
			const result = await autoUpdater.downloadUpdate();
			void reportTelemetry("update_download_completed");
			return result;
		} catch (error) {
			void reportTelemetry("update_download_failed");
			throw error;
		}
	});
}

function updateHandler() {
	handle("app:update", async (_event) => {
		DeviceService.getInstance().markUpdatePending(app.getVersion());
		await Promise.race([reportTelemetry("update_install_started"), new Promise((resolve) => setTimeout(resolve, 1000))]);
		return (await getAutoUpdater()).quitAndInstall();
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
