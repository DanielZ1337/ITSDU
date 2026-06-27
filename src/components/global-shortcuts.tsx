import { useShowSettingsModal } from "@/hooks/atoms/useSettingsModal";
import { useSettings } from "@/hooks/atoms/useSettings";
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
	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
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
		}

		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [handleDarkModeToggle]);

	return <></>;
}
