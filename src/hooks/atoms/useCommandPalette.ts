import { useAtom } from "jotai";
import { commandPaletteAtom } from "@/atoms/command-palette";

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
