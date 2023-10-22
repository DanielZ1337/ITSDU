import MessageChatMessage from "@/components/messages/message-chat-message";
import { Suspense, useEffect, useRef } from "react";
import MessagesSidebar from "@/components/messages/messages-sidebar.tsx";
import { currentChatAtom, currentChatEnum } from '@/atoms/current-chat.ts';
import { useAtom } from "jotai";
import { messageSelectedRecipientsAtom } from "@/atoms/message-selected-recipients";
import MessagesChatHeader from "@/components/messages/messages-chat-header.tsx";
import MessagesChatInputsField from "@/components/messages/messages-chat-inputs-field.tsx";
import useGETinstantMessagesForThread from "@/queries/messages/useGETinstantMessagesForThread.ts";
import { useUser } from "@/atoms/user";
import { useInView } from "framer-motion";
import { Loader2 } from "lucide-react";
import useGETinstantMessagesv2 from "@/queries/messages/useGETinstantMessagesv2";


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
                <MessagesSidebar />
            </div>
            <div className="flex flex-col w-3/4">
                <MessagesChatHeader recipientsSelected={recipientsSelected} />
                <div className="flex-1 p-4 overflow-x-hidden overflow-y-auto flex flex-col-reverse gap-4">
                    {isExistingChat && (
                        <Suspense fallback={
                            <div className="flex justify-center items-center h-full m-auto">
                                <Loader2 className={"stroke-foreground shrink-0 h-6 w-6 animate-spin m-auto"} />
                            </div>
                        }>
                            <MessageChat threadId={currentChat} />
                        </Suspense>
                    )}
                </div>
                {isNewChatOrExistingChat && (
                    <MessagesChatInputsField key={currentChat} />
                )}
            </div>
        </div>
    )
}

function MessageChat({ threadId }: {
    threadId: number
}) {
    const { data: messages, isFetchingNextPage, fetchNextPage, hasNextPage } = useGETinstantMessagesForThread({
        threadId,
        pageSize: 10,
    }, {
        suspense: true,
    })

    const user = useUser()

    const ref = useRef<HTMLDivElement>(null)

    const isInView = useInView(ref)

    useEffect(() => {
        if (isInView && hasNextPage) {
            fetchNextPage()
        }
    }, [isInView, fetchNextPage])

    return (
        <>
            {messages?.pages.map((page) => page.Messages.EntityArray.map((message) => (
                <MessageChatMessage me={user!.PersonId === message.CreatedBy}
                    pictureUrl={message.CreatedByAvatar}
                    messageText={message.Text}
                    author={message.CreatedByName}
                    time={message.CreatedRelative}
                    edited={message.IsEdited}
                    key={message.MessageId}
                    attachmentName={message.AttachmentName}
                    attachmentUrl={message.AttachmentUrl}
                    isSystemMessage={message.IsSystemMessage}
                    canDelete={message.CanDelete}
                />
            )))}

            {hasNextPage && (
                <div className="flex justify-center items-center" ref={ref} />
            )}

            <div className="m-auto w-10 h-10">
                {isFetchingNextPage && (
                    <Loader2 className={"stroke-foreground shrink-0 h-6 w-6 animate-spin m-auto"} />
                )}
            </div>
        </>
    )
}