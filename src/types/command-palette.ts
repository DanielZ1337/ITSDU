import type React from "react";

export type CommandPaletteGroup =
	| "navigation"
	| "courses"
	| "resources"
	| "tasks"
	| "calendar"
	| "messages"
	| "settings"
	| "actions";

export type CommandPaletteItem = {
	id: string;
	group: CommandPaletteGroup;
	title: string;
	subtitle?: string;
	icon?: React.ReactNode;
	shortcut?: string;
	keywords?: string;
	perform: () => void;
};
