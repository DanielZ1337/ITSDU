# Migration notes

## Identity and user data (unchanged)
appId `itsdu`, productName `ITSDU`, protocol schemes `itsl-itslearning` and `itsl-itslearning-file`, artifact names,
electron-store names for settings/window/site data, and the `file://` renderer origin (localStorage/IndexedDB stay put).

## Auth store
- New per-install random key in `userData/itsdu-store-key.bin` (wrapped by the OS keychain when available).
- Tokens move from `itsdu-auth-store[-dev]` to `itsdu-auth-store[-dev]-v2` on first start. The legacy file is deleted only
  after a verified copy; if the legacy key is missing or the copy fails the legacy file is left untouched and the user signs in again.
- `VITE_ITSLEARNING_STORE_KEY` is now only needed for that one-time migration and can be dropped from CI after enough releases.
- OAuth `state` is random per sign-in (no `VITE_ITSLEARNING_OAUTH_STATE`).
- Compatibility of electron-store 11 with data written by 8.2.0 is covered by `tests/electron-store-compat.test.ts`.

## Renderer/main boundary
- No raw `ipcRenderer` in the page. `window.events.on(channel, cb)` accepts an allow-list of push channels
  (`electron/ipc/channels.ts`); everything else is a named `window.*` API backed by `handle()` (`electron/ipc/secure.ts`),
  which only accepts messages from the app's own windows.
- `app:openExternal`, `app:openShell`, `app:openItem`, `app:getPath`, `scrape-page` validate input (`electron/ipc/validators.ts`).
- Windows: `contextIsolation` + `sandbox` on, `nodeIntegration` off, navigation locked, permissions denied except a short list.
  `<webview>` (SSO element) is still enabled but attached with no preload, sandboxed, https-only, in its own partition.
- Production builds ship a CSP (`vite.config.mts`). `connect-src`/`img-src` allow any https host because course content and API
  hosts vary per customer; tighten once traffic is inventoried. `rsms.me` (Inter font) is allowed until the font is self-hosted.
- `session.protocol.registerBufferProtocol` was replaced by `protocol.handle`.

## Known follow-ups
- Self-host the Inter font; drop `rsms.me` from the CSP.
- Route the renderer's API calls through the main process so access tokens never reach page JavaScript (the renderer still
  attaches `access_token` to API requests today, as before).
- `/ai-chats` calls an external AI backend (`itsdu.danielz.dev`); the e2e skips it.
- macOS signing/notarization and Windows signing are not configured (`CSC_IDENTITY_AUTO_DISCOVERY=false`).
- Windows/Linux ARM64 builds are not produced.
- Query hygiene review (query keys, duplicate requests) is recommendation-only: global defaults are `retry: false`,
  `refetchOnMount: false`, `refetchOnWindowFocus: false`; consider `retry: 1` for transient network errors after measuring.
