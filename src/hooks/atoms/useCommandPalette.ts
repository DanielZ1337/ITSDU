import { commandPaletteAtom } from "@/atoms/command-palette";
import { useAtom } from "jotai";

export const useCommandPalette = () => {
	const [isCommandPaletteOpen, setIsCommandPaletteOpen] =
		useAtom(commandPaletteAtom);

	const toggleCommandPalette = () => setIsCommandPaletteOpen((open) => !open);

	return {
		isCommandPaletteOpen,
		setIsCommandPaletteOpen,
		toggleCommandPalette,
	};
};
