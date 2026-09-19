/* eslint-disable no-unused-vars */
import { contextBridge, ipcRenderer } from "electron";
import { createEventsApi, LOGIN_PUSH_CHANNELS } from "./ipc/channels";

// --------- Expose some API to the Renderer process ---------
// Set by the main process (mock mode); undefined means "use the default itslearning site".
const apiBaseUrl = process.argv
	.find((arg) => arg.startsWith("--itsdu-api-base-url="))
	?.slice("--itsdu-api-base-url=".length);
contextBridge.exposeInMainWorld("runtime", { apiBaseUrl });

contextBridge.exposeInMainWorld(
	"events",
	createEventsApi(ipcRenderer, LOGIN_PUSH_CHANNELS),
);

contextBridge.exposeInMainWorld("darkMode", {
	toggle: () => ipcRenderer.invoke("dark-mode:toggle"),
	system: () => ipcRenderer.invoke("dark-mode:system"),
	get: () => ipcRenderer.invoke("dark-mode:get"),
	/*subscribe: (listener: (event: Electron.IpcRendererEvent, shouldUseDarkColors: boolean) => void) => {
        ipcRenderer.on('dark-mode:updated', listener)
    }*/
});

contextBridge.exposeInMainWorld("itslearning", {
	setOrganisation: async (customerId: number) => {
		await ipcRenderer.invoke("itslearning:setOrganisation", customerId);
	},
	login: async () => {
		await ipcRenderer.invoke("itslearning:login");
	},
});

// edit window object and type definition
declare global {
	// eslint-disable-next-line no-unused-vars
	interface Window {
		darkMode: {
			toggle: () => Promise<boolean>;
			system: () => Promise<void>;
			get: () => Promise<boolean>;
		};
		itslearning: {
			setOrganisation: (customerId: number) => Promise<void>;
			login: () => Promise<void>;
		};
	}
}

// --------- Apply the current theme class as early as possible ---------
function domReady(
	condition: DocumentReadyState[] = ["complete", "interactive"],
) {
	return new Promise<void>((resolve) => {
		if (condition.includes(document.readyState)) {
			resolve();
			return;
		}
		document.addEventListener("readystatechange", () => {
			if (condition.includes(document.readyState)) resolve();
		});
	});
}

domReady().then(async () => {
	const theme = await ipcRenderer.invoke("dark-mode:get");
	document.documentElement.classList.add(theme);
});
