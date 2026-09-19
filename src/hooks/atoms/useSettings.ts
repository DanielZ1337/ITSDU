import { useAtom } from "jotai";
import { useCallback, useEffect, useRef } from "react";
import { settingsAtom, settingsHydratedAtom } from "@/atoms/settings";
import {
	defaultSettings,
	isSettingsPath,
	normalizeSettings,
	type SettingsChanges,
	type SettingsOptions,
	type SettingsPath,
	type SettingValue,
} from "@/types/settings";

const legacySettingsStorageKey = "settings";
const migrationStorageKey = "settings:migrated-to-electron-store";

function readLegacySettings() {
	try {
		const rawSettings = localStorage.getItem(legacySettingsStorageKey);
		const rawTheme = localStorage.getItem("theme");
		const parsedSettings = rawSettings ? JSON.parse(rawSettings) : {};

		// `settings` may hold the grouped shape or the older flat one; normalizeSettings reads both.
		const normalized = normalizeSettings(parsedSettings);
		if (rawTheme) {
			return normalizeSettings({
				...normalized,
				appearance: { ...normalized.appearance, theme: rawTheme },
			});
		}
		return normalized;
	} catch (error) {
		console.error("Failed to read legacy settings:", error);
		return null;
	}
}

function persistCompatibilityCopy(settings: SettingsOptions) {
	try {
		localStorage.setItem(legacySettingsStorageKey, JSON.stringify(settings));
		localStorage.setItem("theme", settings.appearance.theme);
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
		async (changes: SettingsChanges) => {
			let nextSettings = settings;

			for (const path of Object.keys(changes)) {
				if (!isSettingsPath(path)) continue;
				nextSettings = await window.settings.set(path, changes[path] as never);
			}

			setSettings(nextSettings);
			persistCompatibilityCopy(nextSettings);
			return nextSettings;
		},
		[settings, setSettings],
	);

	const setSetting = useCallback(
		async <P extends SettingsPath>(path: P, value: SettingValue<P>) => {
			const nextSettings = await window.settings.set(path, value);
			setSettings(nextSettings);
			persistCompatibilityCopy(nextSettings);
			return nextSettings;
		},
		[setSettings],
	);

	const resetSetting = useCallback(
		async (path: SettingsPath) => {
			const nextSettings = await window.settings.reset(path);
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
