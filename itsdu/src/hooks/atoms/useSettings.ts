import { settingsAtom } from "@/atoms/settings";
import { defaultSettings, SettingsOptions } from "@/types/settings";
import { useAtom } from "jotai";

export function useSettings() {
	const [settings, setSettings] = useAtom(settingsAtom);

	if (!localStorage.getItem("settings")) {
		localStorage.setItem("settings", JSON.stringify(defaultSettings));
	}

	// check all keys in settings and add any missing ones
	const localStorageSettings = JSON.parse(localStorage.getItem("settings")!);
	const localStorageSettingsKeys = Object.keys(localStorageSettings);
	const settingsKeys = Object.keys(settings);
	const missingKeys = settingsKeys.filter(
		(key) => !localStorageSettingsKeys.includes(key),
	);
	if (missingKeys.length > 0) {
		const newSettings = { ...localStorageSettings, ...defaultSettings };
		localStorage.setItem("settings", JSON.stringify(newSettings));
		setSettings(newSettings);
	}

	const updateSettings = async (newSettings: Partial<SettingsOptions>) => {
		try {
			// update using localStorage
			const mergedSettings = { ...settings, ...newSettings };
			localStorage.setItem("settings", JSON.stringify(mergedSettings));
			setSettings(mergedSettings);
		} catch (error) {
			console.error("Error updating settings:", error);
		}
	};

	return { settings, updateSettings };
}
