import { defineConfig } from "@farmfe/core";
import farmPostcssPlugin from "@farmfe/js-plugin-postcss";
import path from "node:path";

export default defineConfig({
	plugins: ["@farmfe/plugin-react", "@farmfe/plugin-sass", farmPostcssPlugin()],
	compilation: {
		resolve: {
			alias: {
				"@/": path.resolve(process.cwd(), "src"),
			},
		},
		lazyCompilation: false,
	},
	clearScreen: false,
	server: {
		cors: false,
		port: 1420,
		strictPort: true,
		proxy: {
			"/restapi": {
				target: "http://localhost:9090",
				changeOrigin: true,
				secure: false,
				on: {
					proxyReq: (proxyReq, req, res) => {
						console.log("Sending Request to the Target:", req.method, req.url);
					},
				},
			},
		},
		hmr: {
			watchOptions: {
				ignored: ["**/src-tauri/**"],
			},
		},
	},
});
