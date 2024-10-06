import { defineConfig } from "vite";
import { resolve } from "node:path";
// import electron from 'vite-plugin-electron/simple'
import electron from "vite-plugin-electron";
import react from "@vitejs/plugin-react";
import jotaiDebugLabel from "jotai/babel/plugin-debug-label";
import jotaiReactRefresh from "jotai/babel/plugin-react-refresh";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
    target: "esnext",
    minify: "esbuild",
    rollupOptions: {
      input: {
        main: resolve(process.cwd(), "index.html"),
        login: resolve(process.cwd(), "login.html"),
      },
    },
  },
  plugins: [
    react({ babel: { plugins: [jotaiDebugLabel, jotaiReactRefresh] } }),
    electron([
      {
        entry: "electron/main.ts",
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
});
