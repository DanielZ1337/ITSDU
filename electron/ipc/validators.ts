import net from "node:net";
import path from "node:path";
import { app } from "electron";

const ALLOWED_PATH_NAMES = new Set([
	"downloads",
	"documents",
	"desktop",
	"pictures",
	"temp",
]);
const BLOCKED_EXTENSIONS = new Set([
	".exe",
	".bat",
	".cmd",
	".com",
	".scr",
	".msi",
	".msp",
	".ps1",
	".psm1",
	".vbs",
	".vbe",
	".js",
	".jse",
	".wsf",
	".wsh",
	".lnk",
	".hta",
	".jar",
	".reg",
	".cpl",
	".dll",
	".sh",
	".command",
	".app",
	".pkg",
	".dmg",
	".deb",
	".appimage",
]);

/** Only web and mail links may be handed to the operating system. */
export function assertSafeExternalUrl(value: unknown): URL {
	if (typeof value !== "string") throw new Error("URL must be a string");
	const url = new URL(value);
	if (!["https:", "http:", "mailto:"].includes(url.protocol)) {
		throw new Error(`Blocked URL scheme: ${url.protocol}`);
	}
	return url;
}

export function assertAllowedPathName(
	name: unknown,
): Parameters<typeof app.getPath>[0] {
	if (typeof name !== "string" || !ALLOWED_PATH_NAMES.has(name))
		throw new Error(`Path name not allowed: ${String(name)}`);
	return name as Parameters<typeof app.getPath>[0];
}

function isInside(root: string, target: string): boolean {
	const relative = path.relative(path.resolve(root), path.resolve(target));
	return (
		relative === "" ||
		(!relative.startsWith("..") && !path.isAbsolute(relative))
	);
}

/**
 * A local path the app may open: absolute, inside one of `roots`, and not an executable type.
 * Folders are fine; files with launchable extensions are refused.
 */
export function assertOpenableLocalPath(
	value: unknown,
	roots: string[],
): string {
	if (typeof value !== "string" || !path.isAbsolute(value))
		throw new Error("Path must be absolute");
	const resolved = path.resolve(value);
	if (!roots.some((root) => root && isInside(root, resolved)))
		throw new Error("Path is outside allowed folders");
	if (BLOCKED_EXTENSIONS.has(path.extname(resolved).toLowerCase()))
		throw new Error("Refusing to open executable file types");
	return resolved;
}

function isPrivateHost(hostname: string): boolean {
	const host = hostname.replace(/^\[|\]$/g, "").toLowerCase();
	if (
		host === "localhost" ||
		host.endsWith(".localhost") ||
		host.endsWith(".local") ||
		host.endsWith(".internal")
	)
		return true;
	const kind = net.isIP(host);
	if (kind === 4) {
		const [a, b] = host.split(".").map(Number);
		return (
			a === 10 ||
			a === 127 ||
			a === 0 ||
			(a === 169 && b === 254) ||
			(a === 172 && b >= 16 && b <= 31) ||
			(a === 192 && b === 168)
		);
	}
	if (kind === 6)
		return (
			host === "::1" ||
			host.startsWith("fc") ||
			host.startsWith("fd") ||
			host.startsWith("fe80")
		);
	return false;
}

/** http(s) URLs to public hosts only (used before the main process fetches a renderer-supplied URL). */
export function assertPublicHttpUrl(value: unknown): URL {
	if (typeof value !== "string") throw new Error("URL must be a string");
	const url = new URL(value);
	if (!["https:", "http:"].includes(url.protocol))
		throw new Error(`Blocked URL scheme: ${url.protocol}`);
	if (url.username || url.password)
		throw new Error("Credentials in URL are not allowed");
	if (isPrivateHost(url.hostname))
		throw new Error("Private hosts are not allowed");
	return url;
}
