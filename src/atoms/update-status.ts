import { atom } from "jotai";

export const updateReadyAtom = atom<boolean>(false);
export const updateAvailableVersionAtom = atom<string | null>(null);
export const updateCheckErrorAtom = atom<string | null>(null);
