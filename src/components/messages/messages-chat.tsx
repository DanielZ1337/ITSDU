import MessageChatMessage from './message-chat-message'
import { useUser } from '@/hooks/atoms/useUser.ts'
import useGETinstantMessagesForThread from '@/queries/messages/useGETinstantMessagesForThread'
import useFetchNextPageOnInView from '@/hooks/useFetchNextPageOnView'
import { Loader } from '../ui/loader'
import { DEFAULT_PAGE_SIZE } from '@/lib/constants'
import { useEffect, useMemo, useRef, useState } from 'react'
import { GETinstantMessagesForThread } from '@/types/api-types/messages/GETinstantMessagesForThread'
import { InfiniteData } from '@tanstack/react-query'

export default function MessageChat({ threadId }: {
    threadId: number
}) {
    const { data, isFetchingNextPage, fetchNextPage, hasNextPage } = useGETinstantMessagesForThread({
        threadId,
        pageSize: DEFAULT_PAGE_SIZE,
    }, {
        suspense: true,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        refetchOnMount: true,
        refetchInterval: 1000 * 10,
        refetchIntervalInBackground: true,
    })

    let messages = useRef<InfiniteData<GETinstantMessagesForThread>>(data!)

    useEffect(() => {
        messages.current = data!
    }, [threadId])

    // data.pages.filter where the id in messages doesn't exist
    const newMessages = data?.pages.filter((page) => {
        return !messages.current.pages.some((message) => message.Messages.EntityArray.some((message) => message.MessageId === page.Messages.EntityArray[0].MessageId))
    })

    messages.current = {
        ...messages.current,
        pages: [...newMessages!, ...messages.current.pages]
    }

    const user = useUser()

    const ref = useFetchNextPageOnInView(hasNextPage, fetchNextPage, isFetchingNextPage)

    return (
        <>
            {messages.current.pages.map((page) => page.Messages.EntityArray.map((message) => (
                <MessageChatMessage
                    me={user!.PersonId === message.CreatedBy}
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