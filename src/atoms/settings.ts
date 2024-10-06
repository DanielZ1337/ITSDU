import { SettingsOptions, defaultSettings } from "@/types/settings";
import { atom } from "jotai";

export const settingsAtom = atom<SettingsOptions>(
  localStorage.getItem("settings")
    ? { ...defaultSettings, ...JSON.parse(localStorage.getItem("settings")!) }
    : defaultSettings,
);
