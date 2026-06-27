import { ipcMain, nativeTheme } from "electron";
import { SettingsService } from "../services/settings/settings-service";

function darkModeToggleHandler() {
	ipcMain.handle("dark-mode:toggle", () => {
		const settingsService = SettingsService.getInstance();
		const nextTheme = nativeTheme.shouldUseDarkColors ? "light" : "dark";
		settingsService.set("theme", nextTheme);
		return nextTheme === "dark";
	});
}

function darkModeSetSystemHandler() {
	ipcMain.handle("dark-mode:system", () => {
		SettingsService.getInstance().set("theme", "system");
	});
}

function darkModeGetHandler() {
	ipcMain.handle("dark-mode:get", () => {
		return nativeTheme.shouldUseDarkColors;
	});
}

function darkModeSetHandler() {
	ipcMain.handle("dark-mode:set", (_, value) => {
		SettingsService.getInstance().set("theme", value ? "dark" : "light");
	});
}

function darkModeSubscribeHandle() {
	ipcMain.handle("dark-mode:subscribe", (event) => {
		nativeTheme.on("updated", () => {
			event.sender.send("dark-mode:updated", nativeTheme.shouldUseDarkColors);
		});
	});
}

export default function darkModeHandlerInitializer() {
	darkModeToggleHandler();
	darkModeSetSystemHandler();
	darkModeGetHandler();
	darkModeSubscribeHandle();
	darkModeSetHandler();
}

//     parent.appendChild(child)
//     },
//     remove(parent: HTMLElement, child: HTMLElement) {
//         parent.removeChild(child)
//     },
// }
//
