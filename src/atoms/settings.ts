import { atom } from "jotai";
import { defaultSettings, SettingsOptions } from "@/types/settings";

export const settingsAtom = atom<SettingsOptions>(defaultSettings);
export const settingsHydratedAtom = atom(false);
