import path from "node:path";
import { describe, expect, it } from "vitest";
import {
	assertAllowedPathName,
	assertOpenableLocalPath,
	assertPublicHttpUrl,
	assertSafeExternalUrl,
} from "../electron/ipc/validators";

describe("assertSafeExternalUrl", () => {
	it("allows web and mail links", () => {
		expect(assertSafeExternalUrl("https://example.com/a").hostname).toBe("example.com");
		expect(assertSafeExternalUrl("mailto:a@b.dk").protocol).toBe("mailto:");
	});
	it.each(["file:///C:/Windows/system32/calc.exe", "javascript:alert(1)", "smb://host/share", "ms-msdt:/x"])("blocks %s", (u) => {
		expect(() => assertSafeExternalUrl(u)).toThrow();
	});
	it("rejects non-strings", () => {
		expect(() => assertSafeExternalUrl(42)).toThrow();
	});
});

describe("assertAllowedPathName", () => {
	it("allows a fixed set of Electron paths", () => {
		expect(assertAllowedPathName("downloads")).toBe("downloads");
	});
	it.each(["userData", "exe", "appData", "../x", 1])("blocks %s", (n) => {
		expect(() => assertAllowedPathName(n)).toThrow();
	});
});

describe("assertOpenableLocalPath", () => {
	const root = path.resolve("/tmp/itsdu-downloads");
	it("allows files and folders inside an allowed root", () => {
		expect(assertOpenableLocalPath(path.join(root, "a.pdf"), [root])).toBe(path.join(root, "a.pdf"));
		expect(assertOpenableLocalPath(root, [root])).toBe(root);
	});
	it("blocks traversal, relative paths and other roots", () => {
		expect(() => assertOpenableLocalPath(path.join(root, "..", "secret.txt"), [root])).toThrow();
		expect(() => assertOpenableLocalPath("a.pdf", [root])).toThrow();
		expect(() => assertOpenableLocalPath(path.resolve("/etc/passwd"), [root])).toThrow();
	});
	it("refuses launchable file types even inside an allowed root", () => {
		for (const name of ["setup.exe", "run.BAT", "x.lnk", "a.ps1", "tool.sh"]) {
			expect(() => assertOpenableLocalPath(path.join(root, name), [root])).toThrow();
		}
	});
});

describe("assertPublicHttpUrl", () => {
	it("allows public http(s) hosts", () => {
		expect(assertPublicHttpUrl("https://example.com/x").hostname).toBe("example.com");
	});
	it.each([
		"http://localhost:3000",
		"http://127.0.0.1/",
		"http://10.0.0.5/",
		"http://192.168.1.1/",
		"http://172.16.0.1/",
		"http://169.254.169.254/latest/meta-data",
		"http://[::1]/",
		"http://printer.local/",
		"ftp://example.com",
		"https://user:pw@example.com",
	])("blocks %s", (u) => {
		expect(() => assertPublicHttpUrl(u)).toThrow();
	});
});
