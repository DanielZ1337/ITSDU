import { useAtom } from "jotai/index";
import { sidebarActiveAtom } from "@/atoms/sidebar.ts";

export const useSidebar = () => {
	const [sidebarActive, setSidebarActive] = useAtom(sidebarActiveAtom);

	const toggleSidebar = () => setSidebarActive((active) => !active);

	return { sidebarActive, setSidebarActive, toggleSidebar };
};
