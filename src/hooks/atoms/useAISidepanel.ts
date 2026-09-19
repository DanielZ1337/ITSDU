import { useAtom } from "jotai";
import { aiSidepanelAtom } from "@/atoms/ai-sidepanel";

export const useAISidepanel = () => {
	const [aiSidepanel, setAISidepanel] = useAtom(aiSidepanelAtom);

	const toggleSidebar = () => {
		setAISidepanel((prev) => !prev);
	};

	return { aiSidepanel, setAISidepanel, toggleSidebar };
};
