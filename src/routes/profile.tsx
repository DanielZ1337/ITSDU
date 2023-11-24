import { useUser } from "@/hooks/atoms/useUser.ts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePOSTpersonUpdateProfileImage } from "@/queries/person/usePOSTpersonUpdateProfileImage";

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
        <div className="p-10 m-auto w-full">
            <div className="border rounded-lg shadow-lg p-6 px-8 max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold mb-4 text-center py-4">User Profile</h2>
                <div className="border rounded-lg bg-foreground/10 py-8 px-4">
                    <div className="flex items-center mb-4 justify-center space-x-20">
                        <div
                            className="flex-shrink-0 w-20 h-20 border-2 border-primary/20 rounded-full overflow-hidden relative group">
                            <button
                                className="absolute inset-0 bg-primary/50 opacity-0 z-10 group-hover:opacity-100 backdrop-blur-sm group-hover:bg-primary/40 transition-all rounded-full flex items-center justify-center">
                                <label
                                    className="absolute inset-0 flex items-center justify-center text-white text-sm font-semibold cursor-pointer">
                                    Upload
                                </label>
                                <input
                                    type="file"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={handleFileUpload}
                                />
                            </button>
                            <Avatar className="w-full h-full absolute">
                                <AvatarImage src={user.ProfileImageUrl} alt={user.FullName} className="object-cover" />
                                <AvatarFallback className="bg-foreground/10 font-normal text-lg">
                                    {user.FullName?.split(" ").map((name) => name[0]).slice(0, 3).join("")}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        <div className="ml-4">
                            <div className="font-semibold">Name:</div>
                            <div>{user.FullName}</div>
                        </div>
                    </div>
                    <div className="h-px bg-foreground/20 my-8" />
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 text-left">
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
        <div className="flex justify-between items-center">
            <div className="font-semibold">{title}</div>
            <div>{value}</div>
        </div>
    )
}