import { useAtom } from "jotai";
import { aboutModalAtom } from "@/atoms/about-modal";

export const useAboutModal = () => {
	const [showAboutModal, setShowAboutModal] = useAtom(aboutModalAtom);

	const toggleAboutModal = () => {
		setShowAboutModal((prev) => !prev);
	};

	return { showAboutModal, setShowAboutModal, toggleAboutModal };
};
