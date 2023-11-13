import { useAtom } from "jotai/index";
import { settingsModalAtom } from "@/atoms/settings-modal.ts";

export const useShowSettingsModal = () => {
    const [showSettingsModal, setShowSettingsModal] = useAtom(settingsModalAtom)

    const toggleSettingsModal = () => setShowSettingsModal(show => !show)

    return { showSettingsModal, setShowSettingsModal, toggleSettingsModal }
}