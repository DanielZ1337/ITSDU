import { settingsAtom, settingsHydratedAtom } from "@/atoms/settings";
import {
	defaultSettings,
	normalizeSettings,
	type SettingsKey,
	type SettingsOptions,
} from "@/types/settings";
import { useAtom } from "jotai";
import { useCallback, useEffect, useRef } from "react";

const legacySettingsStorageKey = "settings";
const migrationStorageKey = "settings:migrated-to-electron-store";

function readLegacySettings() {
	try {
		const rawSettings = localStorage.getItem(legacySettingsStorageKey);
		const rawTheme = localStorage.getItem("theme");
		const parsedSettings = rawSettings ? JSON.parse(rawSettings) : {};

		return normalizeSettings({
			...defaultSettings,
			...parsedSettings,
			...(rawTheme ? { theme: rawTheme } : {}),
		});
	} catch (error) {
		console.error("Failed to read legacy settings:", error);
		return null;
	}
}

function persistCompatibilityCopy(settings: SettingsOptions) {
	try {
		localStorage.setItem(legacySettingsStorageKey, JSON.stringify(settings));
		localStorage.setItem("theme", settings.theme);
	} catch (error) {
		console.error("Failed to write settings compatibility copy:", error);
	}
}

export function useSettings() {
	const [settings, setSettings] = useAtom(settingsAtom);
	const [isHydrated, setIsHydrated] = useAtom(settingsHydratedAtom);
	const hydrationStarted = useRef(false);

	useEffect(() => {
		if (hydrationStarted.current) return;
		hydrationStarted.current = true;

		let unsubscribe: (() => void) | undefined;
		let isMounted = true;

		async function hydrateSettings() {
			try {
				let nextSettings: SettingsOptions;
				const legacySettings = readLegacySettings();

				if (
					legacySettings &&
					localStorage.getItem(migrationStorageKey) !== "true"
				) {
					nextSettings =
						await window.settings.migrateLocalStorage(legacySettings);
					localStorage.setItem(migrationStorageKey, "true");
				} else {
					nextSettings = await window.settings.getAll();
				}

				if (!isMounted) return;
				setSettings(nextSettings);
				setIsHydrated(true);
				persistCompatibilityCopy(nextSettings);

				unsubscribe = window.settings.subscribe((updatedSettings) => {
					setSettings(updatedSettings);
					persistCompatibilityCopy(updatedSettings);
				});
			} catch (error) {
				console.error("Failed to hydrate settings:", error);
				if (!isMounted) return;
				const fallbackSettings = readLegacySettings() ?? defaultSettings;
				setSettings(fallbackSettings);
				setIsHydrated(true);
			}
		}

		void hydrateSettings();

		return () => {
			isMounted = false;
			unsubscribe?.();
		};
	}, [setIsHydrated, setSettings]);

	const updateSettings = useCallback(
		async (newSettings: Partial<SettingsOptions>) => {
			let nextSettings = settings;

			for (const key of Object.keys(newSettings) as SettingsKey[]) {
				nextSettings = await window.settings.set(key, newSettings[key] as never);
			}

			setSettings(nextSettings);
			persistCompatibilityCopy(nextSettings);
			return nextSettings;
		},
		[settings, setSettings],
	);

	const setSetting = useCallback(
		async <K extends SettingsKey>(key: K, value: SettingsOptions[K]) => {
			const nextSettings = await window.settings.set(key, value);
			setSettings(nextSettings);
			persistCompatibilityCopy(nextSettings);
			return nextSettings;
		},
		[setSettings],
	);

	const resetSetting = useCallback(
		async (key: SettingsKey) => {
			const nextSettings = await window.settings.reset(key);
			setSettings(nextSettings);
			persistCompatibilityCopy(nextSettings);
			return nextSettings;
		},
		[setSettings],
	);

	const resetAllSettings = useCallback(async () => {
		const nextSettings = await window.settings.resetAll();
		setSettings(nextSettings);
		persistCompatibilityCopy(nextSettings);
		return nextSettings;
	}, [setSettings]);

	const chooseDownloadDirectory = useCallback(async () => {
		const nextSettings = await window.settings.chooseDownloadDirectory();
		setSettings(nextSettings);
		persistCompatibilityCopy(nextSettings);
		return nextSettings;
	}, [setSettings]);

	return {
		settings,
		isHydrated,
		updateSettings,
		setSetting,
		resetSetting,
		resetAllSettings,
		chooseDownloadDirectory,
	};
}
