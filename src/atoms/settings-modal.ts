import { atom } from "jotai";

export const settingsModalAtom = atom<boolean>(false);
export const settingsModalSectionAtom = atom<string | null>(null);
