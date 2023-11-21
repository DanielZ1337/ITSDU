import { cn } from "@/lib/utils"
import MessageAvatar from "./message-avatar"
import ParseMarkdown from "../parse-markdown"

export default function Message({ message, children, from }: {
    message?: string,
    children?: React.ReactNode,
    from: "You" | "ITSDU AI"
}) {

    return (
        <div className="flex flex-row items-start justify-start py-3 overflow-x-hidden">
            <div className="flex-shrink-0">
                <MessageAvatar from={from} />
            </div>
            <div className="flex flex-col ml-2 drop-shadow">
                <span className="font-bold">{from}</span>
                <span
                    className={cn("text-white bg-primary/30 rounded-md p-2 w-fit whitespace-pre-wrap", from === "You" ? "bg-blue-500" : "bg-green-600")}>
                    {children && <span className='flex items-center justify-center'>{children}</span>}
                    {message && <ParseMarkdown code={message} />}
                </span>
            </div>
        </div>
    )
}