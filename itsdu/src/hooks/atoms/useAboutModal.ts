import { aboutModalAtom } from "@/atoms/about-modal";
import { useAtom } from "jotai";

export const useAboutModal = () => {
	const [showAboutModal, setShowAboutModal] = useAtom(aboutModalAtom);

	const toggleAboutModal = () => {
		setShowAboutModal((prev) => !prev);
	};

	return { showAboutModal, setShowAboutModal, toggleAboutModal };
};
