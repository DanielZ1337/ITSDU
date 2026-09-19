// Generates tests/fixtures/electron-store-v8/* with electron-store 8.x.
// Run once BEFORE upgrading electron-store, then commit the output:
//   node tests/fixtures/make-electron-store-v8-fixture.cjs
const path = require("node:path");
const Store = require("electron-store");

const cwd = path.join(__dirname, "electron-store-v8");
const auth = new Store({ cwd, name: "auth-store", encryptionKey: "fixture-encryption-key" });
auth.set("access_token", "ACCESS-éÿ-OK");
auth.set("refresh_token", "REFRESH-TOKEN-123");

const settings = new Store({ cwd, name: "settings", defaults: { theme: "dark" } });
settings.set("authRefreshIntervalMinutes", 30);
console.log("wrote fixtures to", cwd);
