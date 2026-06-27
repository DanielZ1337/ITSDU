export type NavigationType = {
	title?: string;
	labelKey?: import("@/lib/i18n").TranslationKey;
	icon: React.ReactNode;
	href: string;
	end?: boolean;
	disabled?: boolean;
};
