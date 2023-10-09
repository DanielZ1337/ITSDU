import MessagesSidebarChat from "@/components/messages/messages-sidebar-chat.tsx";
import {GETinstantMessagesv2} from "@/types/api-types/messages/GETinstantMessagesv2.ts";

export default function MessagesSidebar({
                                            messages,
                                            setCurrentChat
                                        }: {
    messages: GETinstantMessagesv2,
    setCurrentChat: (id: number | undefined) => void
}) {
    return (
        <div className="w-1/4 border-r overflow-y-auto overflow-x-hidden">
            {messages.EntityArray.map((message) => (
                <MessagesSidebarChat
                    key={message.InstantMessageThreadId}
                    title={message.LastMessage.Text}
                    author={message.LastMessage.CreatedByShortName}
                    pictureUrl={message.LastMessage.CreatedByAvatar}
                />
            ))}
        </div>
    )
}