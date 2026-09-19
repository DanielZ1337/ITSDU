// Builds the app with the mock origin allowed by the CSP, then runs the Playwright Electron tests.
import { spawnSync } from "node:child_process";

const npx = process.platform === "win32" ? "npx.cmd" : "npx";
const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const env = { ...process.env, ITSLEARNING_MOCK_URL: "http://localhost:4899" };
const run = (cmd, args) =>
	spawnSync(cmd, args, {
		stdio: "inherit",
		env,
		shell: process.platform === "win32",
	});

if (run(npm, ["run", "build"]).status !== 0) process.exit(1);
process.exit(
	run(npx, ["playwright", "test", ...process.argv.slice(2)]).status ?? 1,
);
