export type AppNotificationSource = "message" | "task" | "calendar" | "update";

export type AppNotificationItem = {
	id: string;
	source: AppNotificationSource;
	title: string;
	description?: string;
	timestamp: Date;
	unread: boolean;
	href?: string;
};

export type AppNotificationGroupKey = "now" | "today" | "earlier";

export type AppNotificationGroup = {
	key: AppNotificationGroupKey;
	label: string;
	items: AppNotificationItem[];
};
