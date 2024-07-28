import { TabButtonHoverContext } from "@/contexts/tab-button-hover-context";
import { useContext } from "react";

export const useTabButtonHover = () => useContext(TabButtonHoverContext);
