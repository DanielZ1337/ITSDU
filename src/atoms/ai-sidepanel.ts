import { atom } from "jotai";
import { defaultSettings } from "@/types/settings";

export const aiSidepanelAtom = atom(defaultSettings.ai.defaultChatSidepanel);
