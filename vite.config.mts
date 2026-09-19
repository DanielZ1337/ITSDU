import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
// import electron from 'vite-plugin-electron/simple'
import electron from "vite-plugin-electron";

// Production-only CSP (dev needs inline scripts for HMR). connect/img stay on https: because course content
// and API calls go to itslearning-owned hosts that vary per customer; tighten once measured.
// Only builds made with ITSLEARNING_MOCK_URL set (mock/e2e builds) also allow that origin.
const mockOrigin = process.env.ITSLEARNING_MOCK_URL
	? new URL(process.env.ITSLEARNING_MOCK_URL).origin
	: "";

const contentSecurityPolicy = [
	"default-src 'self'",
	"script-src 'self' 'wasm-unsafe-eval'",
	"style-src 'self' 'unsafe-inline' https://rsms.me",
	`img-src 'self' data: blob: https: itsl-itslearning-file: ${mockOrigin}`.trim(),
	"font-src 'self' data: https://rsms.me",
	`connect-src 'self' blob: https: ${mockOrigin}`.trim(),
	"media-src 'self' blob: https:",
	"worker-src 'self' blob:",
	"frame-src https: blob:",
	"object-src 'none'",
	"base-uri 'self'",
	"form-action 'none'",
].join("; ");

const csp = () => ({
	name: "itsdu-csp",
	apply: "build" as const,
	transformIndexHtml: (html: string) =>
		html.replace(
			"<head>",
			`<head>
    <meta http-equiv="Content-Security-Policy" content="${contentSecurityPolicy}" />`,
		),
});

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
	build: {
		outDir: "dist",
		emptyOutDir: true,
		// Do not ship sourcemaps in production builds.
		sourcemap: false,
		target: "esnext",
		rollupOptions: {
			input: {
				main: resolve(process.cwd(), "index.html"),
				login: resolve(process.cwd(), "login.html"),
			},
		},
	},
	plugins: [
		react(),
		tailwindcss(),
		csp(),
		electron([
			{
				entry: "electron/main.ts",
				vite: {
					resolve: {
						alias: {
							undici: resolve(process.cwd(), "electron/stubs/undici.ts"),
						},
					},
					build: {
						minify: command === "build",
						rollupOptions: {
							// Dev-only API proxy: loaded from node_modules in development, never shipped.
							external: ["express", "cors", "http-proxy-middleware"],
						},
					},
				},
			},
			{
				entry: "electron/preload.ts",
				onstart({ reload }) {
					// Notify the Renderer process to reload the page when the Preload scripts build is complete,
					// instead of restarting the entire Electron App.
					reload();
				},
			},
			{
				entry: "electron/login_preload.ts",
				onstart({ reload }) {
					// Notify the Renderer process to reload the page when the Preload scripts build is complete,
					// instead of restarting the entire Electron App.
					reload();
				},
			},
		]),
	],
	resolve: {
		alias: {
			"@": resolve(process.cwd(), "./src"),
		},
	},
}));
