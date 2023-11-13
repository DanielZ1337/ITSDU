import { sidebarActiveAtom } from "@/atoms/sidebar.ts";
import { useAtom } from "jotai/index";

export const useSidebar = () => {
    const [sidebarActive, setSidebarActive] = useAtom(sidebarActiveAtom)

    const toggleSidebar = () => setSidebarActive(active => !active)

    return { sidebarActive, setSidebarActive, toggleSidebar }
}