import { Suspense } from "react";
import MessagesSidebar from "@/components/messages/messages-sidebar.tsx";
import { currentChatAtom, currentChatEnum } from '@/atoms/current-chat.ts';
import { useAtom } from "jotai";
import { messageSelectedRecipientsAtom } from "@/atoms/message-selected-recipients";
import MessagesChatHeader from "@/components/messages/messages-chat-header.tsx";
import MessagesChatInputsField from "@/components/messages/messages-chat-inputs-field.tsx";
import MessageChat from "./messages-chat";
import MessagesChatFallback from "./fallbacks/messages-chat-fallback";
import useGETinstantMessagesForThread from "@/queries/messages/useGETinstantMessagesForThread";


export default function Messages() {
    const [currentChat] = useAtom(currentChatAtom)
    const [recipientsSelected] = useAtom(messageSelectedRecipientsAtom)
    const isExistingChat = currentChat !== currentChatEnum.NONE && currentChat !== currentChatEnum.NEW
    const isNewChat = currentChat === currentChatEnum.NEW
    const isNewChatOrExistingChat = isExistingChat || isNewChat
    // const filteredMessages = messages?.pages.map((page) => page.EntityArray).flat().filter((thread) => thread.InstantMessageThreadId === currentChat)

    const { data: messages } = useGETinstantMessagesForThread({
        threadId: currentChat!,
        pageSize: 1,
    }, {
        enabled: isExistingChat,
    })

    const disabledInputsField = messages?.pages[0].Messages.EntityArray[0].IsBroadcastMassMessage

    return (
        <div className="flex h-full w-full flex-1 overflow-y-hidden">
            <div className="w-1/4 overflow-x-hidden overflow-y-hidden border-r">
                <MessagesSidebar />
            </div>
            <div className="flex w-3/4 flex-col">
                <MessagesChatHeader recipientsSelected={recipientsSelected} />
                <div className="flex flex-1 flex-col-reverse gap-4 overflow-y-auto overflow-x-hidden p-4">
                    {isExistingChat && (
                        <Suspense fallback={<MessagesChatFallback />}>
                            <MessageChat threadId={currentChat} />
                        </Suspense>
                    )}
                </div>
                {isNewChatOrExistingChat && !disabledInputsField && (
                    <MessagesChatInputsField key={currentChat} />
                )}
            </div>
        </div>
    )
}