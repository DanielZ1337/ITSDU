import path from "node:path";

/**
 * Path to the app icon for nativeImage-backed APIs (BrowserWindow, Tray, dialog).
 * Chromium's .ico decoder on Linux can fail on multi-resolution ICOs with PNG-compressed
 * frames (ours included), so Linux gets the plain PNG instead.
 */
export function getAppIconPath(): string {
	const name = process.platform === "linux" ? "i_logo_colored.png" : "icon.ico";
	return path.join(process.env.VITE_PUBLIC, name);
}
