import { defineConfig } from "@farmfe/core";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import farmJsPluginPostcss from "@farmfe/js-plugin-postcss";
import path from "path";

const host = process.env.TAURI_DEV_HOST;

export default defineConfig({
  plugins: [
    "@farmfe/plugin-react",
    "@farmfe/plugin-sass",
    farmJsPluginPostcss(),
  ],
  vitePlugins: [TanStackRouterVite()],
  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
  },
  compilation: {
    // TailwindCSS currently doesn't get updated by Farm due to caching
    persistentCache: false,
    resolve: {
      alias: {
        "@": path.resolve(process.cwd(), "src"),
      },
    },
    // TODO: about-modal depends on this atm, delete when it's fixed
    external: ["electron-updater"],
  },
});
