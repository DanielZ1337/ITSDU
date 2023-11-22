import { useAISidepanel } from '@/hooks/atoms/useAISidepanel';
import { useUser } from '@/hooks/atoms/useUser';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Message from './message';
import { Spinner } from '@nextui-org/spinner';
import { BsStopCircleFill } from 'react-icons/bs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useGETcheckElementID from '@/queries/AI/useGETcheckElementID';
import useGETpreviousMessages from '@/queries/AI/useGETpreviousMessages';
import { MessageType } from '@/types/ai-message';
import { useQueryClient } from '@tanstack/react-query';
import { TanstackKeys } from '@/types/tanstack-keys';

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

    const { data: previousMessages, isLoading: isPreviousMessagesLoading } = useGETpreviousMessages(elementId, {
        enabled: aiSidepanel,
    })

    const reversedPreviousMessages = previousMessages?.slice().reverse()

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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (message.trim() === '' || messageIsLoading || !elementExists) return
        setChatMessages(prev => [{ content: message, role: 'user', timestamp: new Date() }, ...prev])
        await chatCompletion()
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
                        const updatedMessage = { ...lastMessage, content: lastMessage.content + decodedChunk } as MessageType;
                        return [updatedMessage, ...prev.slice(1)];
                    } else {
                        return [newMessage, ...prev];
                    }
                });
            }
            /* const queryClient = useQueryClient()
            queryClient.invalidateQueries([TanstackKeys.AIpreviousMessages, elementId]) */
            setMessage('')
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
        }
    }

    return (
        <div
            className={cn("flex flex-col transition-all overflow-hidden max-h-full shrink-0 w-[33vw] border-l-4")}>
            <div className="flex flex-col flex-1 p-4 overflow-hidden max-h-full">
                <div className="flex flex-col flex-1 p-4 rounded-md bg-foreground/10 max-h-full">
                    <div className="flex flex-col items-center justify-center p-4">
                        <img src="itsl-itslearning-file://icon.ico" alt="Logo" className="w-8 h-8" />
                        <h1 className="text-2xl font-bold mt-2">ITSDU AI</h1>
                    </div>
                    <div
                        className="flex flex-col flex-1 p-4 rounded-md bg-foreground/10 overflow-hidden space-y-4 max-h-full">
                        <div className="flex flex-1 px-2 overflow-y-auto max-h-full flex-col-reverse -ml-2">
                            {elementExistsLoading || uploadingDocument || isPreviousMessagesLoading && (
                                <Loader2 className={"animate-spin text-white m-auto"} />
                            )}
                            {error && (
                                <div className="flex flex-row items-center justify-center">
                                    <span className="text-red-500">{error}</span>
                                </div>
                            )}
                            {chatMessages.map((message, i) => (
                                <motion.div
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
                                        <Message key={chatMessages.length - i} role={message.role} message={message.content} />
                                    )}
                                </motion.div>
                            ))}
                            {reversedPreviousMessages && reversedPreviousMessages.map((message, i) => (
                                <motion.div
                                    key={reversedPreviousMessages.length - i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2, delay: 0.1 * i }}
                                >
                                    <Message key={reversedPreviousMessages.length - i} role={message.role} message={message.content} />
                                </motion.div>
                            ))}
                        </div>
                        {messageIsLoading && (
                            <Button className="flex-shrink-0" onClick={abortResponse}>
                                <BsStopCircleFill size={24} className="text-red-500/80 mr-2" />
                                Stop Generating...
                            </Button>
                        )}
                        <form onSubmit={handleSubmit}
                            className="flex flex-row items-center justify-between space-x-2 rounded-md shrink-0">
                            <Input onChange={(e) => setMessage(e.target.value)} value={message}
                                disabled={messageIsLoading}
                                placeholder="Type your message here..." />
                            <Button disabled={!elementExists || messageIsLoading || message.trim() === ''}
                                type="submit" className="flex-shrink-0 ml-2">
                                Send
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}