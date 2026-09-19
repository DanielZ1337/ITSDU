# IPC inventory (pre-migration)

Preload namespaces (`electron/preload.ts`): ipcRenderer (raw, removed in Phase 3), auth, darkMode, settings, notification, app,
itslearning_file_scraping, ai, download, cookies, resources, scrape. Login preload: ipcRenderer, darkMode, itslearning.
Events used by the renderer: tray:navigate, app:updateDownloaded, app:downloadProgress, download:progress|complete|error,
main-process-message, settings:changed, auth:statusChanged.
Risky handlers (unvalidated input): app:openShell, app:openExternal, app:getPath, scrape-page.
