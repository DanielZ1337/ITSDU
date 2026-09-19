import { atom } from "jotai";

export const versionAtom = atom(async () => await window.app.getVersion());
