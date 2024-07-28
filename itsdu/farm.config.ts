import { defineConfig } from "@farmfe/core";
import farmPostcssPlugin from "@farmfe/js-plugin-postcss";
import path from "node:path";

export default defineConfig({
	plugins: ["@farmfe/plugin-react", farmPostcssPlugin()],
	compilation: {
		resolve: {
			alias: {
				"@/": path.resolve(process.cwd(), "src"),
			},
		},
	},
	clearScreen: false,
	server: {
		port: 1420,
		strictPort: true,
		hmr: {
			watchOptions: {
				ignored: ["**/src-tauri/**"],
			},
		},
	},
});
