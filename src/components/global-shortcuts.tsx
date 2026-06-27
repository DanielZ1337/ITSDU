import { useCommandPalette } from "@/hooks/atoms/useCommandPalette";
import { useSettings } from "@/hooks/atoms/useSettings";
import { useShowSettingsModal } from "@/hooks/atoms/useSettingsModal";
import { useTheme } from "next-themes";
import { useCallback, useEffect } from "react";

export function GlobalShortcuts() {
	const { setTheme, resolvedTheme } = useTheme();
	const { setSetting } = useSettings();

	const handleDarkModeToggle = useCallback(async () => {
		const nextTheme = resolvedTheme === "dark" ? "light" : "dark";
		await setSetting("theme", nextTheme);
		setTheme(nextTheme);
	}, [resolvedTheme, setSetting, setTheme]);

	const { toggleSettingsModal } = useShowSettingsModal();
	const { toggleCommandPalette } = useCommandPalette();

	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			const withModifier = e.ctrlKey || e.metaKey;

			if (e.ctrlKey && e.key === "t") {
				e.preventDefault();
				handleDarkModeToggle();
			}

			if (e.ctrlKey && e.key === "q") {
				e.preventDefault();
				window.app.exit().then((r) => {
					console.log(r);
				});
			}
			if (e.ctrlKey && e.key === "s") {
				e.preventDefault();
				toggleSettingsModal();
			}
			if (withModifier && e.key === "k") {
				e.preventDefault();
				toggleCommandPalette();
			}
			if (withModifier && e.key === ",") {
				e.preventDefault();
				toggleSettingsModal();
			}
		}

		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [handleDarkModeToggle, toggleCommandPalette, toggleSettingsModal]);

	return <></>;
}
