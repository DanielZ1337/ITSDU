import { Loader2 } from 'lucide-react'
import MessageChatMessage from './message-chat-message'
import { useUser } from '@/hooks/atoms/useUser.ts'
import useGETinstantMessagesForThread from '@/queries/messages/useGETinstantMessagesForThread'
import useFetchNextPageOnInView from '@/hooks/useFetchNextPageOnView'
import { Loader } from '../ui/loader'

export default function MessageChat({ threadId }: {
    threadId: number
}) {
    const { data: messages, isFetchingNextPage, fetchNextPage, hasNextPage } = useGETinstantMessagesForThread({
        threadId,
        pageSize: 10,
    }, {
        suspense: true,
    })

    const user = useUser()

    const ref = useFetchNextPageOnInView(hasNextPage, fetchNextPage, isFetchingNextPage)

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
                <div className="flex items-center justify-center" ref={ref} />
            )}

            {isFetchingNextPage && (
                <div className="m-auto h-10 w-10">
                    <Loader className={"m-auto"} />
                </div>
            )}
        </>
    )
}