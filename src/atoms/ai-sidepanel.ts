import { SettingsOptions, defaultSettings } from "@/types/settings";
import { atom } from "jotai";

export const aiSidepanelAtom = atom(
	localStorage.getItem("settings")
		? (JSON.parse(localStorage.getItem("settings")!) as SettingsOptions)
				.DefaultAIChatSidepanel
		: defaultSettings.DefaultAIChatSidepanel,
);
