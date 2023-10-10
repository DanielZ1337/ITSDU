import {cn} from "@/lib/utils.ts";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import he from "he"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Button} from "@/components/ui/button.tsx";
import {ChevronDown} from "lucide-react";

export default function MessageChat({
                                        me,
                                        pictureUrl,
                                        messageText,
                                        author,
                                        time,
                                        edited,
                                        attachmentName,
                                        attachmentUrl,
                                        isSystemMessage,
                                    }: {
    me: boolean
    pictureUrl: string
    messageText: string
    author: string
    time: string
    edited?: boolean
    attachmentName?: string
    attachmentUrl?: string
    isSystemMessage?: boolean
}) {

    return (
        <div className={cn("mb-4 flex", me ? "justify-end" : "justify-start")}>
            <div className={cn('relative', me ? "order-2 ml-3" : "order-1 mr-3")}>
                <Avatar>
                    <AvatarImage src={pictureUrl}
                                 alt={author}/>
                    <AvatarFallback>
                        {author.split(" ").map((name) => name[0]).slice(0, 3).join("")}
                    </AvatarFallback>
                </Avatar>
                {me && (
                    <div className={"absolute -bottom-2 -left-1.5"}>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant={"ghost"} size={"smSquare"}>
                                    <ChevronDown/>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align={"end"}>
                                <DropdownMenuItem>Copy</DropdownMenuItem>
                                <DropdownMenuItem>Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )}
            </div>
            <div className={cn(me ? "order-1" : "order-2")}>
                <p className={cn("text-sm text-gray-500 ", me ? 'text-end' : 'text-start')}>
                    {time}
                    {edited && <span className={"text-gray-400"}> (edited)</span>}
                </p>
                <div
                    className={cn("mt-1 bg-foreground/10 p-2 rounded-lg inline-block", me ? 'float-right bg-blue-500 text-white' : 'float-left')}>
                    <p className={cn("whitespace-pre-wrap break-all", isSystemMessage && 'text-foreground/80 italic')}>{he.decode(messageText)}</p>
                    {attachmentUrl && (
                        <a href={attachmentUrl} target={"_blank"} rel={"noopener noreferrer"}
                           className={"text-blue-500 hover:underline"}>{attachmentName}</a>
                    )}
                </div>
            </div>
        </div>
    )
}

/*
return (
    <div className={cn("mb-4 flex", me ? "justify-end items-end" : "justify-start items-start")}>
        <div className="mr-3">
            <Avatar>
                <AvatarImage src={pictureUrl}
                             alt={author}/>
                <AvatarFallback>
                    {author.split(" ").map((name) => name[0]).slice(0, 3).join("")}
                </AvatarFallback>
            </Avatar>
        </div>
        <div>
            <p className="text-sm text-gray-500">{new Date(time).toLocaleString()}</p>
            <div className="mt-1 bg-foreground/10 p-2 rounded-lg inline-block">
                <p>{messageText}</p>
            </div>
        </div>
    </div>
)*/
