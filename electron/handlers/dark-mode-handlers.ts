import { nativeTheme } from "electron";
import { handle } from "../ipc/secure";
import { SettingsService } from "../services/settings/settings-service";

function darkModeToggleHandler() {
	handle("dark-mode:toggle", () => {
		const settingsService = SettingsService.getInstance();
		const nextTheme = nativeTheme.shouldUseDarkColors ? "light" : "dark";
		settingsService.set("appearance.theme", nextTheme);
		return nextTheme === "dark";
	});
}

function darkModeSetSystemHandler() {
	handle("dark-mode:system", () => {
		SettingsService.getInstance().set("appearance.theme", "system");
	});
}

function darkModeGetHandler() {
	handle("dark-mode:get", () => {
		return nativeTheme.shouldUseDarkColors;
	});
}

function darkModeSetHandler() {
	handle("dark-mode:set", (_, value) => {
		SettingsService.getInstance().set(
			"appearance.theme",
			value ? "dark" : "light",
		);
	});
}

function darkModeSubscribeHandle() {
	handle("dark-mode:subscribe", (event) => {
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
