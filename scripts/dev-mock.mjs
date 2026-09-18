// Runs the app against the local itslearning mock: starts the mock if it is not already up,
// then starts the normal dev server with ITSLEARNING_MOCK_URL set.
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const mockDir = path.resolve(
	root,
	process.env.ITSLEARNING_MOCK_DIR ?? "../itslearning-mock-api",
);
const mockUrl = process.env.ITSLEARNING_MOCK_URL ?? "http://localhost:4873";
const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const run = (args, cwd, env = {}) =>
	spawn(npm, args, {
		cwd,
		stdio: "inherit",
		shell: process.platform === "win32",
		env: { ...process.env, ...env },
	});

const healthy = async () => {
	try {
		return (await fetch(new URL("/mock/health", mockUrl))).ok;
	} catch {
		return false;
	}
};

let mock = null;
if (await healthy()) {
	console.log(`[dev-mock] Reusing mock at ${mockUrl}`);
} else {
	console.log(`[dev-mock] Starting mock from ${mockDir}`);
	const { port } = new URL(mockUrl);
	mock = run(["start"], mockDir, {
		ITSLEARNING_MOCK_PORT: port || "4873",
		ITSLEARNING_MOCK_BASE_URL: mockUrl,
	});
	for (let i = 0; i < 60 && !(await healthy()); i++)
		await new Promise((r) => setTimeout(r, 500));
	if (!(await healthy())) {
		mock.kill();
		console.error(`[dev-mock] Mock did not come up at ${mockUrl}`);
		process.exit(1);
	}
}

const app = run(["run", "dev"], root, { ITSLEARNING_MOCK_URL: mockUrl });
const stop = () => {
	app.kill();
	mock?.kill();
};
app.on("exit", (code) => {
	mock?.kill();
	process.exit(code ?? 0);
});
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
