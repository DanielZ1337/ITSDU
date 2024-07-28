import { cn } from "@/lib/utils";
import ProfileAvatar from "../profile-avatar";

export default function LightbulletinAvatar({
	src,
	name,
	className,
	classNameFallback,
}: {
	src?: string;
	name?: string;
	className?: string;
	classNameFallback?: string;
}) {
	return (
		<ProfileAvatar
			src={src}
			name={name}
			className={cn("w-10 h-10 border-2 border-primary/20", className)}
			classNameFallback={cn("bg-foreground/10 font-normal", classNameFallback)}
		/>
	);
}

/**
 * <Avatar className={"flex-shrink-0 w-10 h-10 border-2 border-primary/20"}>
 <AvatarImage src={bulletin.PublishedBy.ProfileImageUrlSmall}
 alt={bulletin.PublishedBy.FullName}
 className={"object-cover"}
 />
 <AvatarFallback className={"bg-foreground/10 font-normal"}>
 {getPersonInitials(bulletin.PublishedBy.FullName)}
 </AvatarFallback>
 </Avatar>
 */
