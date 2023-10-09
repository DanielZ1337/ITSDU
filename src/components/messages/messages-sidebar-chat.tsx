/* eslint-disable no-unused-vars */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.tsx";
import he from "he";

export default function MessagesSidebarChat({ title, author, pictureUrl, setCurrentChat }: {
    title: string
    author: string
    pictureUrl: string
    setCurrentChat: () => void
}) {
    return (
        <div
            onClick={setCurrentChat}
            className="p-4 border-b cursor-pointer flex items-center hover:bg-foreground/10 transition-colors">
            <div className="mr-3">
                <Avatar>
                    <AvatarImage src={pictureUrl}
                        alt={author} />
                    <AvatarFallback>
                        {author.split(" ").map((name) => name[0]).slice(0, 3).join("")}
                    </AvatarFallback>
                </Avatar>
            </div>
            <div className={"w-5/6"}>
                <h2 className="font-semibold text-base">{author}</h2>
                <p className="text-sm text-gray-500 line-clamp-1">{he.decode(title)}</p>
            </div>
        </div>
    )
}