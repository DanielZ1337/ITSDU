import type { UserConfig } from "@farmfe/core";

const config: UserConfig = {
  plugins: ["@farmfe/plugin-react"],
  compilation: {
    input: {
      index: "./index.html",
    },
    output: {
      path: "build",
      publicPath: "/",
      targetEnv: "browser",
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
};

export default config;
