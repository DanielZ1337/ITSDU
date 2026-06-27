import { SettingsOptions, defaultSettings } from "@/types/settings";
import { atom } from "jotai";

export const settingsAtom = atom<SettingsOptions>(defaultSettings);
export const settingsHydratedAtom = atom(false);
