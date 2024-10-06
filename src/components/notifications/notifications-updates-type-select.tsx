import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GETcourseNotifications } from "@/types/api-types/courses/GETcourseNotifications";
import { GETnotificationsStream } from "@/types/api-types/notifications/GETnotificationsStream";
import { InfiniteData } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export type UpdatesType = "update" | "announcement" | "all";

export function useUpdatesTypeSelect<
	T extends GETcourseNotifications | GETnotificationsStream,
>(notifications: InfiniteData<T> | undefined) {
	const [selectedUpdatesType, setSelectedUpdatesType] =
		useState<UpdatesType>("all");

	const filteredNotifications = getFilteredUpdates<T>(
		notifications,
		selectedUpdatesType,
	);

	return {
		selectedUpdatesType,
		setSelectedUpdatesType,
		filteredNotifications,
	};
}

export function getFilteredUpdates<
	T extends GETcourseNotifications | GETnotificationsStream,
>(updates: InfiniteData<T> | undefined, updateType: UpdatesType) {
	return updates?.pages.map((page) =>
		page.EntityArray.filter((update) => {
			if (updateType === "all") {
				return true;
			} else if (updateType === "update") {
				return !update.LightBulletin;
			} else if (updateType === "announcement") {
				return update.LightBulletin;
			}
		}),
	);
}

export default function UpdatesTypeSelect({
	update,
	onChange,
}: {
	update: UpdatesType;
	onChange: (updateType: UpdatesType) => void;
}) {
	const [selectedUpdatesType, setSelectedUpdatesType] =
		useState<UpdatesType>(update);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" className="ml-auto select-none">
					{selectedUpdatesType === "update"
						? "Updates"
						: selectedUpdatesType === "announcement"
							? "Announcements"
							: "All"}
					<ChevronDown className="ml-2 h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className={"w-52"}>
				<DropdownMenuCheckboxItem
					checked={selectedUpdatesType === "update"}
					onCheckedChange={(checked) => {
						if (checked) {
							setSelectedUpdatesType("update");
							onChange("update");
						}
					}}
				>
					Updates
				</DropdownMenuCheckboxItem>
				<DropdownMenuCheckboxItem
					checked={selectedUpdatesType === "announcement"}
					onCheckedChange={(checked) => {
						if (checked) {
							setSelectedUpdatesType("announcement");
							onChange("announcement");
						}
					}}
				>
					Announcements
				</DropdownMenuCheckboxItem>
				<DropdownMenuCheckboxItem
					checked={selectedUpdatesType === "all"}
					onCheckedChange={(checked) => {
						if (checked) {
							setSelectedUpdatesType("all");
							onChange("all");
						}
					}}
				>
					All
				</DropdownMenuCheckboxItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
