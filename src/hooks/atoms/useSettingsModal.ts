import {
	settingsModalAtom,
	settingsModalSectionAtom,
} from "@/atoms/settings-modal.ts";
import { useAtom } from "jotai/index";

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
