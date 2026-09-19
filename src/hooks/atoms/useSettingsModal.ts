import { useAtom } from "jotai/index";
import {
	settingsModalAtom,
	settingsModalSectionAtom,
} from "@/atoms/settings-modal.ts";

export const useShowSettingsModal = () => {
	const [showSettingsModal, setShowSettingsModal] = useAtom(settingsModalAtom);
	const [requestedSection, setRequestedSection] = useAtom(
		settingsModalSectionAtom,
	);

	const toggleSettingsModal = () => setShowSettingsModal((show) => !show);

	const openSettingsSection = (section: string) => {
		setRequestedSection(section);
		setShowSettingsModal(true);
	};

	return {
		showSettingsModal,
		setShowSettingsModal,
		toggleSettingsModal,
		requestedSection,
		setRequestedSection,
		openSettingsSection,
	};
};
