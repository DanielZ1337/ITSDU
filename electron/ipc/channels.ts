/** Main -> renderer push channels. The renderer can subscribe to these and nothing else. */
export const PUSH_CHANNELS = [
	"tray:navigate",
	"app:updateDownloaded",
	"app:downloadProgress",
	"download:progress",
	"download:complete",
	"download:error",
	"main-process-message",
	"main-process-error",
] as const;

export type PushChannel = (typeof PUSH_CHANNELS)[number];

/** The login window only needs diagnostics. */
export const LOGIN_PUSH_CHANNELS: readonly PushChannel[] = [
	"main-process-message",
	"main-process-error",
];

export function createEventsApi(
	ipcRenderer: Electron.IpcRenderer,
	allowed: readonly PushChannel[],
) {
	return {
		on: (channel: PushChannel, callback: (payload: any) => void) => {
			if (!allowed.includes(channel)) {
				throw new Error(`Channel not allowed: ${String(channel)}`);
			}
			const listener = (_event: Electron.IpcRendererEvent, payload: unknown) =>
				callback(payload);
			ipcRenderer.on(channel, listener);
			return () => {
				ipcRenderer.removeListener(channel, listener);
			};
		},
	};
}
