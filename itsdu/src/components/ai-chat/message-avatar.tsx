import { useUser } from "@/hooks/atoms/useUser";
import { MessageRole } from "@/types/api-types/AI/GETpreviousMessages";
import { getPersonInitials } from "@/lib/utils";
import ProfileAvatar from "../profile-avatar";

export default function MessageAvatar({ role }: { role: MessageRole }) {
	const user = useUser()!;

	const src =
		role === "user"
			? user?.ProfileImageUrl
			: "itsl-itslearning-file://icon.ico";
	const alt = role === "user" ? user?.FullName : "Logo";

	return (
		<div className="flex flex-row items-start justify-start py-3">
			<ProfileAvatar
				src={src}
				name={alt}
				className={"w-8 h-8 border-2 border-foreground/40"}
				classNameFallback={"bg-foreground/20 text-xs"}
				classNameFallbackAvatar="w-8 h-8 border-2 border-foreground/40"
			>
				{role === "user" ? getPersonInitials(user?.FullName) : "ITSDU AI"}
			</ProfileAvatar>
		</div>
	);
}
