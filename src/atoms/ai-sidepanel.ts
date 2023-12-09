import { SettingsOptions } from "@/types/settings";
import { atom } from "jotai";

export const aiSidepanelAtom = atom((JSON.parse(localStorage.getItem('settings') as string) as SettingsOptions).DefaultAIChatSidepanel)