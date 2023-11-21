import {useUser} from "@/hooks/atoms/useUser"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import SettingsDropdown from "@/components/settings/settings-dropdown"

export default function SidebarUser() {
    const user = useUser()

    return (
        <>
            <Avatar className={"flex-shrink-0 w-10 h-10"}>
                <AvatarImage src={user?.ProfileImageUrl}
                             alt={user?.FullName}
                             className={"object-cover"}
                />
                <AvatarFallback className={"bg-foreground/20 text-sm"}>
                    {user?.FullName.split(" ").map((name) => name[0]).join("").slice(0, 3)}
                </AvatarFallback>
            </Avatar>
            <div
                className={`pl-4 flex justify-between items-center overflow-hidden transition-all`}
            >
                <div className="leading-4 pr-4">
                    <h4 className="font-semibold whitespace-pre-wrap break-all line-clamp-1">{user?.FullName}</h4>
                </div>
                <SettingsDropdown/>
            </div>
        </>
    )
}