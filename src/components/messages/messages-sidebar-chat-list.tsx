import useGETinstantMessagesv2 from '@/queries/messages/useGETinstantMessagesv2';
import {useInView} from 'framer-motion';
import {useEffect, useRef} from 'react'
import MessagesSidebarChat from './messages-sidebar-chat';
import MessageSidebarChatFallback from './fallbacks/message-sidebar-chat-fallback';
import {useUser} from '@/hooks/user'
import {
    ItslearningRestApiEntitiesInstantMessageThread
} from '@/types/api-types/utils/Itslearning.RestApi.Entities.InstantMessageThread';

export default function MessagesSidebarChatList({query}: { query: string }) {

    const user = useUser()

    const {data: messages, fetchNextPage, isFetchingNextPage, hasNextPage} = useGETinstantMessagesv2({
        maxMessages: 1,
        threadPage: 0,
        maxThreadCount: 10,
    }, {
        suspense: true,
    })


    let messagesOrdered = messages?.pages.map((page) => page.EntityArray).flat().sort((a, b) => {
        return new Date(b.LastMessage.Created).getTime() - new Date(a.LastMessage.Created).getTime()
    })

    if (query) {
        messagesOrdered = messagesOrdered?.filter((thread) => thread.Name?.toLowerCase().includes(query.toLowerCase()) || thread.Participants.filter((participant) => participant.PersonId !== user!.PersonId).map((participant) => participant.FullName).join(", ").toLowerCase().includes(query.toLowerCase()))
    }

    const ref = useRef<HTMLDivElement>(null)

    const isInView = useInView(ref)

    useEffect(() => {
        if (isInView && hasNextPage) {
            fetchNextPage()
        }
    }, [isInView, fetchNextPage])

    const isLastMessageRead = (thread: ItslearningRestApiEntitiesInstantMessageThread) => {
        return thread.LastMessage.MessageId === thread.LastReadInstantMessageId
    }

    return (
        <div>
            {messagesOrdered?.map((thread) => (
                <MessagesSidebarChat
                    key={thread.InstantMessageThreadId}
                    title={thread.LastMessage.Text}
                    author={thread.Name || thread.Participants.filter((participant) => participant.PersonId !== user!.PersonId).map((participant) => participant.FullName).join(", ")}
                    pictureUrl={thread.LastMessage.CreatedByAvatar}
                    id={thread.InstantMessageThreadId}
                    canDelete={thread.CanDelete}
                    isRead={isLastMessageRead(thread)}
                />
            ))}

            {isFetchingNextPage && (
                <div className={"animate-in slide-in-from-left-32"}>
                    <MessageSidebarChatFallback/>
                </div>
            )}

            {hasNextPage && <div ref={ref}/>}
        </div>
    )
}
