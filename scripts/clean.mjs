import { rmSync } from "node:fs";

for (const dir of ["dist", "dist-electron"]) rmSync(dir, { recursive: true, force: true });
