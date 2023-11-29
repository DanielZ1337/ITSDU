import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { fallbackImage } from '@/lib/constants'
import { cn, getPersonInitials } from '@/lib/utils'

export default function ProfileAvatar({ src, name, className, classNameFallback, classNameFallbackAvatar, children }: {
    src?: string,
    name?: string,
    className?: string,
    classNameFallback?: string,
    classNameFallbackAvatar?: string,
    children?: React.ReactNode
}) {
    return (
        <Avatar className={cn("flex-shrink-0", className)}>
            <AvatarImage src={src}
                alt={name}
                className={"object-cover"}
            />
            <AvatarFallback>
                <Avatar className={cn("flex-shrink-0", classNameFallbackAvatar)}>
                    <AvatarImage src={fallbackImage}
                        alt={name}
                        className={"object-cover"}
                    />
                    <AvatarFallback className={classNameFallback}>
                        {children ?? getPersonInitials(name)}
                    </AvatarFallback>
                </Avatar>
            </AvatarFallback>
        </Avatar>
    )
}
/* <Avatar className={cn("shrink-0 w-10 h-10 border-2 border-primary/20", className)}>
    <AvatarImage src={src}
                 alt={alt}
                 className={"object-cover"}
    />
    <AvatarFallback className={cn("bg-foreground/10 font-normal", classNameFallback)}>
        {fullname?.split(" ").map((name) => name[0]).slice(0, 3).join("")}
    </AvatarFallback>
</Avatar> */