import SuspenseWrapper from '@/components/suspense-wrapper'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useUser } from '@/hooks/atoms/useUser'
import usePDFbyElementID from '@/hooks/usePDFbyElementID'
import { cn } from '@/lib/utils'
import useGETcheckElementID from '@/queries/AI/useGETcheckElementID'
import { Spinner } from '@nextui-org/spinner'
import { motion } from 'framer-motion';
import { ArrowLeftToLine, ArrowRightToLine, Loader2 } from 'lucide-react'
import React, { Suspense, useEffect, useState } from 'react'
import { BsStopCircleFill } from 'react-icons/bs'
import { useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import gfm from 'remark-gfm'
import { useAISidepanel } from '@/hooks/atoms/useAISidepanel'

export default function Documents() {
    const { elementId } = useParams()
    const { isLoading, src } = usePDFbyElementID(elementId ?? '')

    return (
        <div className="flex flex-1 w-full h-full">
            {isLoading || !src ? (
                <Spinner size="lg" color="primary" label="Loading..." className={"m-auto w-full"} />
            ) : (
                <iframe
                    src={src}
                    className="w-full h-full"
                    title="PDF"
                />
            )}
            <Suspense
                fallback={
                    <div className="flex flex-col flex-1 w-full h-full">
                        <div className="flex flex-row items-center justify-center flex-1 w-full h-full">
                            <Spinner size="lg" color="primary" label="Loading..." className={"m-auto w-full"} />
                        </div>
                    </div>
                }
            >
                <AISidePanel elementId={elementId ?? ''} />
            </Suspense>
        </div>
    )
}

function AISidePanel({ elementId }: { elementId: string | number }) {
    const { aiSidepanel, setAISidepanel } = useAISidepanel()
    const user = useUser()!
    const toggleSidebar = () => {
        setAISidepanel(prev => !prev)
    }

    const [message, setMessage] = useState<string>('')
    const [messageIsLoading, setMessageIsLoading] = useState<boolean>(false)
    const [chatMessages, setChatMessages] = useState<{ message: string, from: "You" | "ITSDU AI" }[]>([])
    const [abortController, setAbortController] = useState<AbortController | null>(null)
    const [uploadingDocument, setUploadingDocument] = useState<boolean>(false)
    const [refetchCount, setRefetchCount] = useState<number>(0)
    const [error, setError] = useState<string | null>(null)

    const { data: elementExists, isLoading: elementExistsLoading, refetch } = useGETcheckElementID(elementId, {
        enabled: aiSidepanel,
    })

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
        setChatMessages(prev => [{ message, from: 'You' }, ...prev])
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
        setChatMessages(prev => [{ message: '', from: 'ITSDU AI' }, ...prev])

        try {
            const res = await fetch(`https://itsdu.danielz.dev/api/message/${elementId}`, {
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
                    const newMessage = { message: decodedChunk, from: 'ITSDU AI' };
                    if (prev.length > 0 && prev[0].from === 'ITSDU AI') {
                        const lastMessage = prev[0];
                        const updatedMessage = { ...lastMessage, message: lastMessage.message + decodedChunk };
                        return [updatedMessage, ...prev.slice(1)];
                    } else {
                        return [newMessage, ...prev];
                    }
                });
            }
            setMessage('')
        } catch (err) {
            if (signal.aborted) {
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
        <div className="flex flex-1 w-full h-full">
            <div className="flex flex-row items-center justify-between p-4 h-full my-auto">
                <Button className="relative group px-6" data-active={aiSidepanel} onClick={toggleSidebar}>
                    <ArrowRightToLine size={24} className='absolute group-data-[active=false]:opacity-0 transition-all' />
                    <ArrowLeftToLine size={24} className='absolute animate-in group-data-[active=true]:opacity-0 transition-all' />
                </Button>
            </div>
            <motion.div className="flex flex-row flex-1 h-full max-h-full overflow-hidden"
                initial={false}
                animate={{ width: aiSidepanel ? '33vw' : 0 }}
                transition={{ duration: 0.2 }}
            >
                <div className={cn("flex flex-col transition-all overflow-hidden max-h-full shrink-0 w-[33vw] border-l-4")}>
                    <div className="flex flex-col flex-1 p-4 overflow-hidden max-h-full">
                        <div className="flex flex-col flex-1 p-4 rounded-md bg-foreground/10 max-h-full">
                            <div className="flex flex-col items-center justify-center p-4">
                                <img src="itsl-itslearning-file://icon.ico" alt="Logo" className="w-8 h-8" />
                                <h1 className="text-2xl font-bold mt-2">ITSDU AI</h1>
                            </div>
                            <div className="flex flex-col flex-1 p-4 rounded-md bg-foreground/10 overflow-hidden space-y-4 max-h-full">
                                <div className="flex flex-1 px-2 overflow-y-auto max-h-full flex-col-reverse -ml-2">
                                    {elementExistsLoading || uploadingDocument && (
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
                                            {i === 0 && messageIsLoading && chatMessages[0].from === 'ITSDU AI' && chatMessages[0].message === '' ? (
                                                <Message key={chatMessages.length - i} from={message.from}>
                                                    <Spinner size="sm" color="primary" className={"m-auto w-full h-full"} />
                                                </Message>
                                            ) : (
                                                <Message key={chatMessages.length - i} from={message.from} message={message.message} />
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                                {messageIsLoading && (
                                    <Button className="flex-shrink-0" onClick={abortResponse}>
                                        <BsStopCircleFill size={24} className="text-red-500/80 mr-2" />
                                        Stop Generating...
                                    </Button>
                                )}
                                <form onSubmit={handleSubmit} className="flex flex-row items-center justify-between space-x-2 rounded-md shrink-0">
                                    <Input onChange={(e) => setMessage(e.target.value)} value={message} disabled={messageIsLoading} type="text" placeholder="Type your message here..." />
                                    <Button disabled={!elementExists || messageIsLoading || message.trim() === ''} type="submit" className="flex-shrink-0 ml-2">
                                        Send
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

function Message({ message, children, from }: { message?: string, children?: React.ReactNode, from: "You" | "ITSDU AI" }) {

    return (
        <div className="flex flex-row items-start justify-start py-3 overflow-x-hidden">
            <div className="flex-shrink-0">
                <MessageAvatar from={from} />
            </div>
            <div className="flex flex-col ml-2">
                <span className="font-bold">{from}</span>
                <span className={cn("text-white bg-primary/30 rounded-md p-2 shadow flex items-center justify-center w-fit whitespace-pre-wrap", from === "You" ? "bg-blue-500" : "bg-green-500/50")}>
                    {children ? children : message}
                    {/* <ReactMarkdown rehypePlugins={[rehypeHighlight]}
                            remarkPlugins={[gfm]}
                        >
                            {message}
                        </ReactMarkdown> */}
                </span>
            </div>
        </div>
    )
}

function MessageAvatar({ from }: { from: "You" | "ITSDU AI" }) {
    const user = useUser()!

    const src = from === "You" ? user?.ProfileImageUrl : "itsl-itslearning-file://icon.ico"
    const alt = from === "You" ? user?.FullName : "Logo"

    return (
        <div className="flex flex-row items-start justify-start py-3">
            <div className="flex-shrink-0">
                <Avatar className={"flex-shrink-0 w-8 h-8 border-2 border-foreground/40"}>
                    <AvatarImage src={src}
                        alt={alt}
                        className={"object-cover"}
                    />
                    <AvatarFallback className={"bg-foreground/20 text-xs"}>
                        {from === "You" ? (
                            user?.FullName.split(" ").map((name) => name[0]).join("").slice(0, 3)
                        ) : (
                            "ITSDU AI"
                        )}
                    </AvatarFallback>
                </Avatar>
            </div>
        </div>
    )
}