import MessagesChatInputFileDialog from "@/components/messages/messages-chat-input-file-dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import usePOSTinstantMessagev2 from "@/queries/messages/usePOSTinstantMessagev2";
import usePOSTmessageAttachment from "@/queries/messages/usePOSTmessageAttachment";
import {useQueryClient} from "@tanstack/react-query";
import {useCallback, useEffect, useRef, useState} from "react";
import {useToast} from "@/components/ui/use-toast";
import {useAtom} from "jotai";
import {currentChatAtom, currentChatEnum} from "@/atoms/current-chat";
import {messageSelectedRecipientsAtom} from "@/atoms/message-selected-recipients";

export default function MessagesChatInputsField() {
    const [files, setFiles] = useState<File[] | null>(null)
    const [message, setMessage] = useState<string>('')
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const [currentChat] = useAtom(currentChatAtom)
    const isNewChat = currentChat === currentChatEnum.NEW
    const queryClient = useQueryClient()
    const {toast} = useToast()
    const [uploadProgress, setUploadProgress] = useState<number>(0)
    const [, setRecipientsSelected] = useAtom(messageSelectedRecipientsAtom)

    const startSimulatedProgress = useCallback(() => {
        setUploadProgress(0)

        const interval = setInterval(() => {
            // simulate upload progress and if it's at 90% then stop
            setUploadProgress((prevProgress) => {
                if (uploadProgress < 90) {
                    const diff = Math.random() * 10;
                    if (prevProgress > 80 && prevProgress < 90) {
                        if (prevProgress + 1 > 90) {
                            return 90
                        } else {
                            return prevProgress + 1
                        }
                    }

                    if (prevProgress + diff > 90) {
                        return 90
                    }

                    return prevProgress + diff
                } else {
                    return prevProgress
                }
            });
        }, 800);

        return interval
    }, [uploadProgress])

    const {mutate: sendMessage, isLoading: isSendingMessage} = usePOSTinstantMessagev2({
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["messagesv2"]
            })
            setMessage('')
            if (textareaRef.current) {
                textareaRef.current.style.height = "auto"
            }
            setRecipientsSelected([])
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
                duration: 3000,
            })
        },
    })

    const {mutate: sendFile, isLoading: isSendingFile} = usePOSTmessageAttachment()

    const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement> | KeyboardEvent) => {
        e.preventDefault()

        if (message === '' && !files) return

        if (files) {
            sendFilesSubmit()
        } else {
            sendMessageSubmit()
        }

    }, [message, files])

    function sendFilesSubmit() {
        if (!files) return

        const interval = startSimulatedProgress()
        sendFile(files, {
            onSuccess: (data) => {
                clearInterval(interval)
                setUploadProgress(100)
                setTimeout(() => {
                    setUploadProgress(0)
                }, 500)
                sendMessage({
                    InstantMessageThreadId: isNewChat ? undefined : currentChat,
                    // ToPersonIds: isNewChat ? personIds : undefined,
                    SendAsIndividualMessages: isNewChat ? false : undefined,
                    // @ts-ignore
                    ReferencedInstantMessageType: isNewChat ? ItslearningRestApiEntitiesReferencedInstantMessageType[ItslearningRestApiEntitiesReferencedInstantMessageType.None] : undefined,
                    FileIds: data.map((file) => file.m_Item1),
                }, {
                    onSuccess: () => {
                        sendMessageSubmit()
                        setFiles(null)
                    }
                })
            }
        })
    }

    function sendMessageSubmit() {
        if (message === '') return

        sendMessage({
            InstantMessageThreadId: isNewChat ? undefined : currentChat,
            // ToPersonIds: isNewChat ? personIds : undefined,
            SendAsIndividualMessages: isNewChat ? false : undefined,
            // @ts-ignore
            ReferencedInstantMessageType: isNewChat ? ItslearningRestApiEntitiesReferencedInstantMessageType[ItslearningRestApiEntitiesReferencedInstantMessageType.None] : undefined,
            Text: message
        }, {
            onError: (error) => {
                toast({
                    title: "Error",
                    description: error.message,
                    variant: "destructive",
                    duration: 3000,
                })

            }
        })
    }

    useEffect(() => {
        function handleSendShortcut(e: KeyboardEvent) {
            if (e.key === 'Enter' && e.ctrlKey) {
                handleSubmit(e)
            }
        }

        window.addEventListener('keydown', handleSendShortcut)

        return () => window.removeEventListener('keydown', handleSendShortcut)
    }, [handleSubmit])

    return (
        <div className="flex max-h-64 flex-col border-t p-4">
            <form className="flex items-center gap-2" onSubmit={handleSubmit}>
                <div className={"flex-1 relative"}>
                    <Textarea rows={1} className="max-h-48 w-full overflow-hidden min-h-[2.5rem]"
                              ref={textareaRef}
                              autoFocus
                              onInput={(e) => {
                                  // resize textarea
                                  e.currentTarget.style.height = "auto"
                                  e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`
                              }}
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                              placeholder="Type your message..."/>
                    <MessagesChatInputFileDialog files={files} setFiles={setFiles} isSendingFile={isSendingFile}
                                                 uploadProgress={uploadProgress}/>
                </div>
                <Button variant={"outline"}
                        className="rounded-full" type="submit"
                        disabled={isSendingMessage || message === '' && !files || isSendingFile}
                >
                    {isSendingMessage || isSendingFile ? "Sending..." : "Send"}
                </Button>
            </form>
        </div>
    )
}