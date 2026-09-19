# Persisted data that must survive the upgrade

electron-store (userData, app name "ITSDU"): `itsdu-auth-store` / `itsdu-auth-store-dev` (encrypted, tokens additionally wrapped with safeStorage),
`itsdu-itslearning-store`, `itsdu-settings`, theme store. Renderer (origin `file://`): localStorage (legacy settings, theme,
notification center, course activity) and IndexedDB (`src/lib/indexedDB.ts`, `src/lib/resource-indexeddb`).

Rules: keep appId `itsdu`, productName `ITSDU`, store names, and the `file://` renderer origin. Mock mode uses separate `-mock` stores.
