import MessageChatMessage from './message-chat-message'
import { useUser } from '@/hooks/atoms/useUser.ts'
import useGETinstantMessagesForThread from '@/queries/messages/useGETinstantMessagesForThread'
import useFetchNextPageOnInView from '@/hooks/useFetchNextPageOnView'
import { Loader } from '../ui/loader'
import { DEFAULT_PAGE_SIZE } from '@/lib/constants'
import { ErrorBoundary } from 'react-error-boundary'

export default function MessageChat({ threadId }: {
    threadId: number
}) {
    const { data: messages, isFetchingNextPage, fetchNextPage, hasNextPage } = useGETinstantMessagesForThread({
        threadId,
        pageSize: DEFAULT_PAGE_SIZE,
    }, {
        suspense: true,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        refetchOnMount: true,
        refetchInterval: 1000 * 10,
        refetchIntervalInBackground: true,
        keepPreviousData: true,
    })

    const user = useUser()

    const ref = useFetchNextPageOnInView(hasNextPage, fetchNextPage, isFetchingNextPage)

    return (
        <>
            <ErrorBoundary
                fallback={<div className="m-auto h-10 w-10"><Loader className={"m-auto"} /></div>}
            >
                {messages!.pages.map((page) => page.Messages.EntityArray.map((message) => (
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
            </ErrorBoundary>

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