import {currentChatAtom} from "@/atoms/current-chat";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {cn} from "@/lib/utils";
import he from "he";
import {useAtom} from "jotai";
import useDELETEinstantMessageThread from "@/queries/messages/useDELETEinstantMessageThread.ts";
import {useToast} from "@/components/ui/use-toast";
import {Trash2Icon} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";

export default function MessagesSidebarChat({title, author, pictureUrl, id, canDelete}: {
    title: string
    author: string
    pictureUrl: string
    id: number
    canDelete?: boolean
}) {
    const [currentChatAtomId, setcurrentChatAtomId] = useAtom(currentChatAtom)
    const {toast} = useToast()

    const {mutate: DELETEinstantMessageThread} = useDELETEinstantMessageThread({
        threadId: id,
    }, {
        onSuccess: () => {
            if (currentChatAtomId === id) {
                setcurrentChatAtomId(undefined)
                toast({
                    title: "Success",
                    description: "Chat deleted",
                    variant: "success",
                    duration: 3000,
                })
            }
        },
    })

    return (
        <div
            onClick={() => setcurrentChatAtomId(id === currentChatAtomId ? undefined : id)}
            className={cn("group p-4 border-b cursor-pointer flex items-center hover:bg-foreground/10 transition-colors", id === currentChatAtomId && 'bg-foreground/10')}>
            <div className="mr-3">
                <Avatar>
                    <AvatarImage src={pictureUrl}
                                 alt={author}/>
                    <AvatarFallback>
                        {author.split(" ").map((name) => name[0]).slice(0, 3).join("")}
                    </AvatarFallback>
                </Avatar>
            </div>
            <div className={"w-5/6"}>
                <h2 className="font-semibold text-base">{author}</h2>
                <p className="text-sm text-gray-500 line-clamp-1 break-all">{he.decode(title)}</p>
            </div>
            {canDelete && (
                <Button
                    variant={"outline"}
                    size={"icon"}
                    onClick={(e) => {
                        e.stopPropagation()
                        DELETEinstantMessageThread({
                            threadId: id,
                        })
                    }} className={"group-hover:flex hidden shrink-0 ml-auto mr-[-0.5rem] p-1 rounded-full"}>
                    <Trash2Icon className={"w-5 h-5 text-destructive hover:text-destructive/80"}/>
                </Button>
            )}
        </div>
    )
}