# Modernization results

Measured on Windows 11, Node 24.5.0, against the itslearning mock API. "Baseline" is `main` (9232a1f) before this branch.
Anything not listed was not measured.

| Metric | Baseline | Now |
| --- | --- | --- |
| Electron / Chromium runtime | 28.2.8 | 44.4.3 (bundles Node 24.21.0) |
| `vite build` | ~42 s | ~4 s |
| Renderer JS (all chunks) | 3,062,065 B | 3,360,108 B (includes the 615 KB on-demand syntax-highlighter language chunk, previously inside `code-block`) |
| JS/CSS loaded by index.html at startup | not measured | 504 KB JS + 170 KB CSS |
| `code-block` chunk | 649,639 B | 40,377 B (languages load on demand) |
| Renderer CSS | 270,193 B | 179,781 B |
| `tsc --noEmit` errors | 125 | 0 (and no `@ts-ignore` left) |
| `npm audit` | 68 (2 critical, 46 high) | 0 |
| `app.asar` (packaged, win x64) | not measured | 59 MB (274 MB when every renderer dependency sat in `dependencies`) |
| Main process: handlers initialised | not measured | +228..304 ms after process start |
| Relaunch with a saved session: main window `did-finish-load` | not measured | +420 ms after process start |
| First sign-in through the mock to a rendered main window | not measured | ~2.4 s |
| Working set, 4 processes, courses page | not measured | 534 MB right after load, 619 MB after 8 s |

Verification that ran: 37 unit tests (Vitest), an Electron end-to-end (Playwright) that signs in through the mock, checks
isolation and the CSP and renders 16 core routes, the same sign-in against the packaged `win-unpacked` build, and
`npm audit`. Not verified here: macOS and Linux packaging, real itslearning login, auto-update from an older release,
code signing.

Notes for reviewers
- `notification-updates`/`MarkAllAsRead` mutations keep their original (prefix-matching) invalidation keys; the array of four
  keys almost certainly never matches a query, so this is a probable existing bug left unchanged on purpose.
- Query v4 `isLoading` semantics were preserved by mapping to `isPending`.
- Panel layouts saved by react-resizable-panels v2 are not migrated (one-time reset of the course split size).
