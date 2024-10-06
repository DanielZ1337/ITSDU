import { createContext, useState } from "react";

type Tab = string | null;

type TabContext = [Tab, React.Dispatch<React.SetStateAction<Tab>>];

// CoursePlansTabButton Hover context
export const TabButtonHoverContext = createContext<TabContext>([
	null,
	() => {},
]);

export function TabButtonHoverProvider({
	children,
}: { children: React.ReactNode }) {
	const [hoveredTab, setHoveredTab] = useState<Tab>(null);

	return (
		<TabButtonHoverContext.Provider value={[hoveredTab, setHoveredTab]}>
			{children}
		</TabButtonHoverContext.Provider>
	);
}
