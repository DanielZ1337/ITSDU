import {useUser} from "@/hooks/atoms/useUser"
import {Avatar, AvatarFallback, AvatarImage} from "@/components//ui/avatar"
import {MessageRole} from "@/types/api-types/AI/GETpreviousMessages"

export default function MessageAvatar({role}: { role: MessageRole }) {
    const user = useUser()!

    const src = role === "user" ? user?.ProfileImageUrl : "itsl-itslearning-file://icon.ico"
    const alt = role === "user" ? user?.FullName : "Logo"

    return (
        <div className="flex flex-row items-start justify-start py-3">
            <div className="flex-shrink-0">
                <Avatar className={"flex-shrink-0 w-8 h-8 border-2 border-foreground/40"}>
                    <AvatarImage src={src}
                                 alt={alt}
                                 className={"object-cover"}
                    />
                    <AvatarFallback className={"bg-foreground/20 text-xs"}>
                        {role === "user" ? (
                            user?.FullName.split(" ").map((name) => name[0]).join("").slice(0, 3)
                        ) : (
                            "ITSDU AI"
                        )}
                    </AvatarFallback>
                </Avatar>
            </div>
        </div>
    )
}