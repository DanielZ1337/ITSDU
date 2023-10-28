import {Suspense} from "react";
import MessagesSidebar from "@/components/messages/messages-sidebar.tsx";
import {currentChatAtom, currentChatEnum} from '@/atoms/current-chat.ts';
import {useAtom} from "jotai";
import {messageSelectedRecipientsAtom} from "@/atoms/message-selected-recipients";
import MessagesChatHeader from "@/components/messages/messages-chat-header.tsx";
import MessagesChatInputsField from "@/components/messages/messages-chat-inputs-field.tsx";
import MessageChat from "./messages-chat";
import MessagesChatFallback from "./fallbacks/messages-chat-fallback";


export default function Messages() {
    const [currentChat] = useAtom(currentChatAtom)
    const [recipientsSelected] = useAtom(messageSelectedRecipientsAtom)
    const isExistingChat = currentChat !== currentChatEnum.NONE && currentChat !== currentChatEnum.NEW
    const isNewChat = currentChat === currentChatEnum.NEW
    const isNewChatOrExistingChat = isExistingChat || isNewChat
    // const filteredMessages = messages?.pages.map((page) => page.EntityArray).flat().filter((thread) => thread.InstantMessageThreadId === currentChat)

    return (
        <div className="flex w-full h-full overflow-y-hidden flex-1">
            <div className="w-1/4 border-r overflow-y-hidden overflow-x-hidden">
                <MessagesSidebar/>
            </div>
            <div className="flex flex-col w-3/4">
                <MessagesChatHeader recipientsSelected={recipientsSelected}/>
                <div className="flex-1 p-4 overflow-x-hidden overflow-y-auto flex flex-col-reverse gap-4">
                    {isExistingChat && (
                        <Suspense fallback={<MessagesChatFallback/>}>
                            <MessageChat threadId={currentChat}/>
                        </Suspense>
                    )}
                </div>
                {isNewChatOrExistingChat && (
                    <MessagesChatInputsField key={currentChat}/>
                )}
            </div>
        </div>
    )
}