import {atom} from "jotai";

export const versionAtom = atom<string>(await window.app.getVersion())