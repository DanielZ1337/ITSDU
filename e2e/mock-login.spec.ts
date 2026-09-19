import { type ChildProcess, spawn } from "node:child_process";
import { existsSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import {
	type ElectronApplication,
	_electron as electron,
	expect,
	test,
} from "@playwright/test";

// Drives the built app (run `npm run build` first) against the itslearning mock API (sibling repo).
const mockDir = path.resolve(
	process.env.ITSLEARNING_MOCK_DIR ?? "../itslearning-mock-api",
);
const port = 4899;
const mockUrl = `http://localhost:${port}`;

let mock: ChildProcess | undefined;
let app: ElectronApplication | undefined;

test.skip(
	!existsSync(path.join(mockDir, "package.json")),
	"itslearning-mock-api not found (set ITSLEARNING_MOCK_DIR)",
);

test.beforeAll(async () => {
	mock = spawn(process.platform === "win32" ? "npm.cmd" : "npm", ["start"], {
		cwd: mockDir,
		shell: process.platform === "win32",
		env: {
			...process.env,
			ITSLEARNING_MOCK_PORT: String(port),
			ITSLEARNING_MOCK_TRACE: "0",
		},
		stdio: "ignore",
	});
	for (let i = 0; i < 60; i++) {
		try {
			if ((await fetch(`${mockUrl}/mock/health`)).ok) return;
		} catch {}
		await new Promise((r) => setTimeout(r, 500));
	}
	throw new Error("mock server did not start");
});

test.afterAll(async () => {
	await app?.close().catch(() => {});
	if (mock?.pid) {
		if (process.platform === "win32")
			spawn("taskkill", ["/pid", String(mock.pid), "/t", "/f"]);
		else mock.kill();
	}
});

test("signs in through the mock and reaches the main window without CSP violations", async () => {
	const userData = mkdtempSync(path.join(tmpdir(), "itsdu-e2e-"));
	app = await electron.launch({
		args: [".", `--user-data-dir=${userData}`],
		env: {
			...process.env,
			ITSLEARNING_MOCK_URL: mockUrl,
			VITE_DEV_SERVER_URL: "",
		},
	});

	const consoleErrors: string[] = [];
	app.on("window", (page) => {
		page.on("console", (m) => {
			if (m.type() === "error" || m.type() === "warning")
				consoleErrors.push(`[${page.url()}] ${m.text()}`);
		});
	});

	// 1) login window (organisation picker)
	const login = await app.firstWindow();
	await expect(login.getByText("Mock University").first()).toBeVisible({
		timeout: 30_000,
	});
	await login.getByText("Mock University").first().click();

	// 2) the sign-in window auto-selects the default persona and redirects back; the main window opens
	await expect
		.poll(
			async () =>
				(
					await app!.evaluate(({ BrowserWindow }) =>
						BrowserWindow.getAllWindows().map((w) => w.webContents.getURL()),
					)
				).some((u) => u.endsWith("/index.html") || u.includes("index.html")),
			{ timeout: 60_000 },
		)
		.toBe(true);

	const main = app.windows().find((w) => w.url().includes("index.html"))!;
	await main.waitForLoadState("domcontentloaded");
	await expect(main.locator("#root")).not.toBeEmpty({ timeout: 30_000 });

	expect(
		consoleErrors.filter((e) => /Content Security Policy|Refused to/i.test(e)),
	).toEqual([]);

	// 3) the renderer is isolated: no Node, no raw ipcRenderer
	const exposed = await main.evaluate(() => ({
		require: typeof (window as any).require,
		process: typeof (window as any).process,
		ipcRenderer: typeof (window as any).ipcRenderer,
		events: typeof (window as any).events?.on,
	}));
	expect(exposed).toEqual({
		require: "undefined",
		process: "undefined",
		ipcRenderer: "undefined",
		events: "function",
	});

	// 4) core routes render against the mock without runtime errors or the error page
	const pageErrors: string[] = [];
	main.on("pageerror", (e) => pageErrors.push(e.message));
	const routes = [
		"/",
		"/overview",
		"/courses",
		"/courses/1001",
		"/courses/1001/tasks",
		"/courses/1001/participants",
		"/courses/1001/schedule",
		"/courses/1001/plans",
		"/courses/1001/resources",
		"/calendar",
		"/resources",
		"/messages",
		"/updates",
		"/all-tasks",
		"/profile",
		"/person/1001", // /ai-chats is skipped: it calls an external AI backend
	];
	const failures: string[] = [];
	for (const route of routes) {
		await main.evaluate((r) => {
			window.location.hash = r;
		}, route);
		await main.waitForTimeout(1500);
		const text = await main.evaluate(() => document.body.innerText);
		if (/unexpected error has occurred|Something went wrong/i.test(text))
			failures.push(`${route}: ${text.slice(0, 120).replace(/\s+/g, " ")}`);
	}
	expect(failures).toEqual([]);
	expect(pageErrors).toEqual([]);
});
