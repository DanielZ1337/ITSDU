import { settingsModalAtom } from "@/atoms/settings-modal.ts";
import { useAtom } from "jotai/index";

export const useShowSettingsModal = () => {
	const [showSettingsModal, setShowSettingsModal] = useAtom(settingsModalAtom);

	const toggleSettingsModal = () => setShowSettingsModal((show) => !show);

	return { showSettingsModal, setShowSettingsModal, toggleSettingsModal };
};
