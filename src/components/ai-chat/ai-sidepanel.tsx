import { useAISidepanel } from '@/hooks/atoms/useAISidepanel';
import { useUser } from '@/hooks/atoms/useUser';
import { cn } from '@/lib/utils';
import { useEffect, useMemo, useRef, useState } from 'react';
import { m } from 'framer-motion';
import Message from './message';
import { Spinner } from '@nextui-org/spinner';
import { BsStopCircleFill } from 'react-icons/bs';
import { Button } from '@/components/ui/button';
import useGETcheckElementID from '@/queries/AI/useGETcheckElementID';
import useGETpreviousMessages from '@/queries/AI/useGETpreviousMessages';
import { MessageType } from '@/types/ai-message';
import useFetchNextPageOnInView from '@/hooks/useFetchNextPageOnView';
import { Textarea } from '../ui/textarea';
import { Loader } from '../ui/loader';

export default function AISidePanel({ elementId }: { elementId: string | number }) {
    const { aiSidepanel } = useAISidepanel()
    const user = useUser()!

    const [message, setMessage] = useState<string>('')
    const [messageIsLoading, setMessageIsLoading] = useState<boolean>(false)
    const [chatMessages, setChatMessages] = useState<MessageType[]>([])
    const [abortController, setAbortController] = useState<AbortController | null>(null)
    const [uploadingDocument, setUploadingDocument] = useState<boolean>(false)
    const [refetchCount, setRefetchCount] = useState<number>(0)
    const [error, setError] = useState<string | null>(null)

    const { data: elementExists, isLoading: elementExistsLoading, refetch } = useGETcheckElementID(elementId, {
        enabled: aiSidepanel,
    })

    const {
        data: previousMessages,
        isLoading: isPreviousMessagesLoading,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage
    } = useGETpreviousMessages({
        elementId: Number(elementId),
    }, {
        enabled: aiSidepanel,
    })

    const ref = useFetchNextPageOnInView(hasNextPage, fetchNextPage)

    const reversedPreviousMessages = useMemo(() => previousMessages?.pages?.map((page) => page.previousMessages).flat().sort((a, b) => {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    }), [previousMessages])

    useEffect(() => {
        const uploadDocumentForAI = async () => {
            if (refetchCount > 0 && !elementExists && !elementExistsLoading) {
                setError('An error occured while uploading the document to the AI')
            }
            if (refetchCount > 0) return
            if (!elementExistsLoading && !elementExists) {
                setUploadingDocument(true)
                await window.ai.upload(Number(elementId))
                setUploadingDocument(false)
                refetch()
                setRefetchCount(prev => prev + 1)
            }
        }
        uploadDocumentForAI()
    }, [elementExists, elementExistsLoading, elementId])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement, MouseEvent> | React.KeyboardEvent<HTMLTextAreaElement>) => {
        e.preventDefault()
        if (message.trim() === '' || messageIsLoading || !elementExists) return
        const newMessage = { content: message, role: 'user', timestamp: new Date() } as MessageType;
        setChatMessages(prev => [newMessage, ...prev])
        await chatCompletion()
    }


    const textAreaRef = useRef<HTMLTextAreaElement>(null)

    const adjustTextAreaHeight = (e: React.ChangeEvent<HTMLTextAreaElement> | string) => {
        if (textAreaRef.current) {
            const message = typeof e === 'string' ? e : e.target.value;
            // if the text area is empty, set the height to 10px
            if (message.trim() === '') {
                textAreaRef.current.style.height = '10px';
            } else if (textAreaRef.current.scrollHeight > 38) {
                textAreaRef.current.style.height = 'auto';
                textAreaRef.current.style.height = textAreaRef.current.scrollHeight + 'px';
            }
        }
    }
    const onMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value)
        adjustTextAreaHeight(e)
    }

    const textAreaOnKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e)
        }
    }


    const abortResponse = () => {
        if (abortController) {
            abortController.abort();
            setAbortController(null);
        }
    };

    const resetMessages = () => {
        if (!messageIsLoading) {
            setChatMessages([]);
        }
    }

    async function chatCompletion() {
        setMessageIsLoading(true)
        const abortController = new AbortController();
        setAbortController(abortController);
        const signal = abortController.signal;
        setChatMessages(prev => [{ content: '', role: 'system' }, ...prev])

        try {
            const url = `https://itsdu.danielz.dev/api/message/${elementId}`
            // const url = `http://localhost:3000/api/message/${elementId}`
            const res = await fetch(url, {
                method: 'POST',
                body: JSON.stringify({
                    message,
                    userId: user.PersonId
                }),
                signal,
            });

            // Rest of the code...

            const reader = res.body?.getReader()

            if (!reader) {
                throw new Error('No reader')
            }

            const decoder = new TextDecoder("utf-8")

            let loop = true

            while (loop) {
                const chunk = await reader.read()

                const { done, value } = chunk

                if (done) {
                    loop = false
                    break
                }

                const decodedChunk = decoder.decode(value)
                // the incoming messsage should be in the first index of the array¨
                setChatMessages(prev => {
                    const newMessage = { content: decodedChunk, role: "system" } as MessageType;
                    if (prev.length > 0 && prev[0].role === 'system') {
                        const lastMessage = prev[0];
                        const updatedMessage = {
                            ...lastMessage,
                            content: lastMessage.content + decodedChunk
                        } as MessageType;
                        return [updatedMessage, ...prev.slice(1)];
                    } else {
                        return [newMessage, ...prev];
                    }
                });
            }
        } catch (err) {
            if (signal.aborted) {
                if (chatMessages[0].content.trim() === '') {
                    setChatMessages(prev => prev.slice(1))
                }
                console.error(`Request aborted`, err);
            } else {
                console.error(`Error during chat response streaming`, err);
            }
        } finally {
            // Remove the AbortController now the response has completed.
            setAbortController(null);
            // Set the loading state to false
            setMessageIsLoading(false);
            setMessage('')
            adjustTextAreaHeight('')
        }
    }

    return (
        <div
            className={cn("flex flex-col transition-all overflow-hidden max-h-full shrink-0 w-[33vw] border-l-4")}>
            <div className="flex max-h-full flex-1 flex-col overflow-hidden p-4">
                <div className="flex max-h-full flex-1 flex-col rounded-md p-4 bg-foreground/10">
                    <div className="flex flex-col items-center justify-center p-4">
                        <img src="itsl-itslearning-file://icon.ico" alt="Logo" className="h-8 w-8" />
                        <h1 className="mt-2 text-2xl font-bold">ITSDU AI</h1>
                    </div>
                    <div
                        className="flex max-h-full flex-1 flex-col overflow-hidden rounded-md p-4 bg-foreground/10 space-y-4">
                        <div className="-ml-2 flex max-h-full flex-1 flex-col-reverse overflow-y-auto px-2">
                            {error && (
                                <div className="flex flex-row items-center justify-center">
                                    <span className="text-red-500">{error}</span>
                                </div>
                            )}
                            {chatMessages.map((message, i) => (
                                <m.div
                                    key={chatMessages.length - i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {i === 0 && messageIsLoading && chatMessages[0].role === 'system' && chatMessages[0].content === '' ? (
                                        <Message key={chatMessages.length - i} role={message.role}>
                                            <Spinner size="sm" color="primary" className={"m-auto w-full h-full"} />
                                        </Message>
                                    ) : (
                                        <Message key={chatMessages.length - i} role={message.role}
                                            message={message.content} />
                                    )}
                                </m.div>
                            ))}
                            {reversedPreviousMessages && reversedPreviousMessages.map((message, i) => (
                                <m.div
                                    key={reversedPreviousMessages.length - i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2, delay: 0.1 * i }}
                                >
                                    <Message key={reversedPreviousMessages.length - i} role={message.role}
                                        message={message.content} />
                                </m.div>
                            ))}
                            {elementExistsLoading || uploadingDocument || isPreviousMessagesLoading ? (
                                <Loader variant={"white"} className={"m-auto"} />
                            ) : (
                                previousMessages && previousMessages.pages.length > 0 && previousMessages.pages[previousMessages.pages.length - 1].totalMessages > previousMessages.pages[previousMessages.pages.length - 1].pageSize && (
                                    <div ref={ref} className="flex flex-row items-center justify-center">
                                        <span
                                            className="text-white/50">{isFetchingNextPage ? 'Loading...' : previousMessages.pages[previousMessages.pages.length - 1].totalMessages > previousMessages.pages[previousMessages.pages.length - 1].pageIndex * previousMessages.pages[previousMessages.pages.length - 1].pageSize ? 'Load more' : 'No more messages'}</span>
                                    </div>
                                )
                            )}
                        </div>
                        {messageIsLoading && (
                            <Button
                                className="flex-shrink-0 bg-white/50 text-black hover:bg-white/40 dark:bg-white dark:hover:bg-white/90"
                                onClick={abortResponse}>
                                <BsStopCircleFill size={24} className="mr-2 text-red-500/80" />
                                Stop Generating...
                            </Button>
                        )}
                        <form onSubmit={handleSubmit}
                            className="flex shrink-0 flex-row items-center justify-between rounded-md space-x-2">
                            <Textarea onKeyDown={textAreaOnKeyDown}
                                ref={textAreaRef}
                                onChange={onMessageChange} value={message}
                                disabled={messageIsLoading}
                                placeholder="Type your message here..."
                                //match the height of the input to the height of the text area
                                className="h-10 max-h-40 flex-1 resize-y overflow-y-auto min-h-10"
                            />
                            <Button disabled={!elementExists || messageIsLoading || message.trim() === ''}
                                type="submit" variant={"secondary"} className="ml-2 flex-shrink-0">
                                Send
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}