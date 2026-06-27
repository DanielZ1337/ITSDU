import { useSettings } from "@/hooks/atoms/useSettings";
import { useTheme } from "next-themes";
import { useEffect } from "react";

export default function SettingsEffects() {
	const { settings, isHydrated } = useSettings();
	const { setTheme } = useTheme();

	useEffect(() => {
		if (!isHydrated) return;
		setTheme(settings.theme);
	}, [isHydrated, setTheme, settings.theme]);

	return null;
}
