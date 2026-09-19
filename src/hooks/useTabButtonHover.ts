import { useContext } from "react";
import { TabButtonHoverContext } from "@/contexts/tab-button-hover-context";

export const useTabButtonHover = () => useContext(TabButtonHoverContext);
