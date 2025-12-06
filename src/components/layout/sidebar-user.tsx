import SettingsDropdown from "@/components/settings/settings-dropdown";
import { useUser } from "@/hooks/atoms/useUser";
import { cn } from "@/lib/utils";
import { useState } from "react";
import ProfileAvatar from "../profile-avatar";

export default function SidebarUser() {
	const user = useUser();

	const [isOpen, setIsOpen] = useState(false);
	const [isHovering, setIsHovering] = useState(false);

	return (
		<SettingsDropdown
			triggerComponent={
				<button
					onMouseEnter={() => setIsHovering(true)}
					onMouseLeave={() => setIsHovering(false)}
					className={cn(
						"w-full flex items-center justify-center",
						"p-2 mx-1 rounded-xl",
						"transition-all duration-200 ease-out",
						"hover:bg-foreground/[0.08] active:scale-95",
						(isHovering || isOpen) && "bg-foreground/[0.05]"
					)}
				>
					<ProfileAvatar
						src={user?.ProfileImageUrl}
						name={user?.FullName}
						className={cn(
							"w-9 h-9 ring-2 ring-offset-2 ring-offset-background transition-all duration-200",
							(isHovering || isOpen)
								? "ring-primary/50 scale-105"
								: "ring-border/50"
						)}
						classNameFallback="bg-muted font-medium text-xs"
					/>
				</button>
			}
			isOpen={isHovering || isOpen}
			onOpenChange={setIsOpen}
			onmouseenter={() => {
				setIsHovering(true);
				setIsOpen(true);
			}}
			onmouseleave={() => {
				setIsHovering(false);
				setIsOpen(false);
			}}
		/>
	);
}
