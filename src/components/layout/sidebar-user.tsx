import { useUser } from "@/hooks/atoms/useUser"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import SettingsDropdown from "@/components/settings/settings-dropdown"
import { getPersonInitials } from "@/lib/utils"
import ProfileAvatar from "../profile-avatar"

export default function SidebarUser() {
    const user = useUser()

    return (
        <>
            <ProfileAvatar
                src={user?.ProfileImageUrl}
                name={user?.FullName}
                className={"w-10 h-10 border-2 border-primary/30"}
                classNameFallback={"bg-foreground/10 font-normal text-sm"}
            />
            <div
                className={`pl-4 flex justify-between items-center overflow-hidden transition-all`}
            >
                <div className="pr-4 leading-4">
                    <h4 className="whitespace-pre-wrap break-all font-semibold line-clamp-1">{user?.FullName}</h4>
                </div>
                <SettingsDropdown />
            </div>
        </>
    )
}