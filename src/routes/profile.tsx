import { useUser } from "@/hooks/atoms/useUser.ts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePOSTpersonUpdateProfileImage } from "@/queries/person/usePOSTpersonUpdateProfileImage";
import ProfileAvatar from "@/components/profile-avatar";

export default function UserProfile() {
    const user = useUser()!

    const { mutate: updateProfilePicture } = usePOSTpersonUpdateProfileImage()

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        const formData = new FormData()
        formData.append('file', file)
        // updateProfilePicture(formData)
    }

    return (
        <div className="m-auto w-full p-10">
            <div className="mx-auto max-w-3xl rounded-lg border p-6 px-8 shadow-lg">
                <h2 className="mb-4 py-4 text-center text-2xl font-bold">User Profile</h2>
                <div className="rounded-lg border px-4 py-8 bg-foreground/10">
                    <div className="mb-4 flex items-center justify-center space-x-20">
                        <div
                            className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-full group">
                            <button
                                className="absolute inset-0 z-10 flex items-center justify-center rounded-full opacity-0 backdrop-blur-sm transition-all group-hover:bg-black/20 group-hover:opacity-100">
                                <label
                                    className="absolute inset-0 flex cursor-pointer items-center justify-center text-sm font-semibold text-white">
                                    Upload
                                </label>
                                <input
                                    type="file"
                                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                                    onChange={handleFileUpload}
                                />
                            </button>
                            <ProfileAvatar
                                src={user.ProfileImageUrl}
                                name={user.FullName}
                                className={"border-3 border-primary/20 transition-all duration-75 w-full h-full absolute"}
                                classNameFallbackAvatar="w-full h-full"
                                classNameFallback={"bg-foreground/10 font-normal text-lg"}
                            />
                        </div>
                        <div className="ml-4">
                            <div className="font-semibold">Name:</div>
                            <div>{user.FullName}</div>
                        </div>
                    </div>
                    <div className="my-8 h-px bg-foreground/20" />
                    <div className="grid grid-cols-2 gap-4 text-left text-sm text-gray-600">
                        <UserItem title="ID" value={user.PersonId} />
                        <UserItem title="Language" value={user.Language} />
                        <UserItem title="Time Zone" value={user.TimeZoneId} />
                        <UserItem title="Can Access Message System" value={user.CanAccessMessageSystem ? 'Yes' : 'No'} />
                        <UserItem title="Can Access Calendar" value={user.CanAccessCalendar ? 'Yes' : 'No'} />
                        <UserItem title="Can Access Personal Settings" value={user.CanAccessPersonalSettings ? 'Yes' : 'No'} />
                    </div>
                </div>
            </div>
        </div>
    )
}

function UserItem({ title, value }: { title: string, value: string | boolean | number }) {
    return (
        <div className="flex items-center justify-between">
            <div className="font-semibold">{title}</div>
            <div>{value}</div>
        </div>
    )
}