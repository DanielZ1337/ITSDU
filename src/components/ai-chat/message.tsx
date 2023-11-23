import {cn} from "@/lib/utils"
import MessageAvatar from "./message-avatar"
import ParseMarkdown from "../parse-markdown"
import {MessageRole} from "@/types/api-types/AI/GETpreviousMessages"

export default function Message({message, children, role}: {
    message?: string,
    children?: React.ReactNode,
    role: MessageRole,
}) {

    return (
        <div className="flex flex-row items-start justify-start py-3 overflow-x-hidden">
            <div className="flex-shrink-0">
                <MessageAvatar role={role}/>
            </div>
            <div className="flex flex-col ml-2 drop-shadow">
                <span className="font-bold">{role === "user" ? "You" : "ITSDU AI"}</span>
                <span
                    className={cn("text-white bg-primary/30 rounded-md p-2 w-fit whitespace-pre-wrap", role === "user" ? "bg-blue-500" : "bg-green-600")}>
                    {children && <span className='flex items-center justify-center'>{children}</span>}
                    {message && <ParseMarkdown code={message}/>}
                </span>
            </div>
        </div>
    )
}