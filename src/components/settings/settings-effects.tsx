import { useTheme } from "next-themes";
import { useEffect } from "react";
import { useSettings } from "@/hooks/atoms/useSettings";

export default function SettingsEffects() {
	const { settings, isHydrated } = useSettings();
	const { setTheme } = useTheme();

	useEffect(() => {
		if (!isHydrated) return;
		setTheme(settings.appearance.theme);
	}, [isHydrated, setTheme, settings.appearance.theme]);

	return null;
}
