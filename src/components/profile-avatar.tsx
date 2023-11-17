import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar'
import {cn} from '@/lib/utils'

export default function ProfileAvatar({src, alt, name: fullname, className, classNameFallback}: {
    src?: string,
    alt?: string,
    name?: string,
    className?: string,
    classNameFallback?: string
}) {
    return (
        <Avatar className={cn("shrink-0 w-10 h-10 border-2 border-primary/20", className)}>
            <AvatarImage src={src}
                         alt={alt}
                         className={"object-cover"}
            />
            <AvatarFallback className={cn("bg-foreground/10 font-normal", classNameFallback)}>
                {fullname?.split(" ").map((name) => name[0]).slice(0, 3).join("")}
            </AvatarFallback>
        </Avatar>
    )
}