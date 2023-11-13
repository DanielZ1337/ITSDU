import {Loader2} from 'lucide-react'
import {useEffect, useRef} from 'react'
import MessageChatMessage from './message-chat-message'
import {useInView} from 'framer-motion'
import {useUser} from '@/hooks/atoms/useUser.ts'
import useGETinstantMessagesForThread from '@/queries/messages/useGETinstantMessagesForThread'

export default function MessageChat({threadId}: {
    threadId: number
}) {
    const {data: messages, isFetchingNextPage, fetchNextPage, hasNextPage} = useGETinstantMessagesForThread({
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

    console.log(messages)

    return (
        <>
            {messages?.pages.map((page) => page.Messages.EntityArray.map((message) => (
                <MessageChatMessage me={user!.PersonId === message.CreatedBy}
                                    id={message.MessageId}
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
                                    isDeleted={message.IsDeleted}
                />
            )))}

            {hasNextPage && (
                <div className="flex justify-center items-center" ref={ref}/>
            )}

            {isFetchingNextPage && (
                <div className="m-auto w-10 h-10">
                    <Loader2 className={"stroke-foreground shrink-0 h-6 w-6 animate-spin m-auto"}/>
                </div>
            )}
        </>
    )
}