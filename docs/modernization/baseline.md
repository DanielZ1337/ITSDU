# Baseline (before modernization)

Measured on `main` (9232a1f) + mock-mode commits, Windows 11, Node 24.5.0, npm 11.5.1, 2026-09-19.

| Metric | Value |
| --- | --- |
| `npm ci --legacy-peer-deps` | ~31 s (plain `npm ci` fails: peer conflict, react-query 4 vs devtools 5) |
| `vite build` | ~42 s |
| Renderer JS (dist/assets/*.js) | 3,062,065 B |
| Renderer CSS | 270,193 B |
| Largest chunks | code-block 649,639 B; component 374,331 B; pdf-renderer 372,718 B; documents 249,463 B; main 164,878 B |
| `tsc --noEmit` | 125 errors (61 TS6133 unused, 21 TS2345, 11 TS2339, 11 TS2322, 6 TS2304) |
| `npm audit` | 68 (2 critical, 46 high, 15 moderate, 5 low) |
| Cold start, idle/peak memory, packaged size | not measured (needs packaged run; see Phase 6) |

Note: `npm run build` on main runs `tsc` first, so it currently fails on the 125 errors.
