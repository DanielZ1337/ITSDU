import useGETinstantMessagesv2 from "@/queries/messages/useGETinstantMessagesv2.ts";
import MessageChat from "@/components/messages/message-chat.tsx";
import useGETcurrentUser from "@/queries/person/useGETcurrentUser.ts";
import {useCallback, useEffect, useRef, useState} from "react";
import MessagesSidebarChat from "@/components/messages/messages-sidebar-chat.tsx";
import usePOSTinstantMessagev2 from "@/queries/messages/usePOSTinstantMessagev2.ts";
import MessagesSidebar from "@/components/messages/messages-sidebar.tsx";
import {useQueryClient} from "@tanstack/react-query";
import {currentChatAtom} from '@/atoms/current-chat.ts';
import {useAtom} from "jotai";
import {useToast} from "@/components/ui/use-toast.ts";
import {messageSelectedRecipientsAtom} from "@/atoms/message-selected-recipients";
import {
    ItslearningRestApiEntitiesReferencedInstantMessageType
} from "@/types/api-types/utils/Itslearning.RestApi.Entities.ReferencedInstantMessageType.ts";
import usePUTinstantMessageThread from "@/queries/messages/usePUTinstantMessageThread.ts";
import usePOSTmessageAttachment from "@/queries/messages/usePOSTmessageAttachment.ts";
import MessagesChatHeader from "@/components/messages/messages-chat-header.tsx";
import MessagesChatInputsField from "@/components/messages/messages-chat-inputs-field.tsx";


export default function Messages() {
    const {data: messages} = useGETinstantMessagesv2({
        maxMessages: 10,
        threadPage: 0,
        maxThreadCount: 10,
    }, {
        suspense: true,
    })

    const {data: user} = useGETcurrentUser({
        suspense: true,
    })

    const [currentChat] = useAtom(currentChatAtom)
    const [message, setMessage] = useState<string>('')
    const queryClient = useQueryClient()
    const {toast} = useToast()
    const [newThreadName, setNewThreadName] = useState<string>('')
    const [isSettingNewThreadName, setIsSettingNewThreadName] = useState<boolean>(false)
    const [files, setFiles] = useState<File[] | null>(null)

    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const chatRef = useRef<HTMLDivElement>(null)
    const [recipientsSelected, setRecipientsSelected] = useAtom(messageSelectedRecipientsAtom)
    const [uploadProgress, setUploadProgress] = useState<number>(0)

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
            setMessage('')
            textareaRef.current!.style.height = "auto"
            queryClient.invalidateQueries({
                queryKey: ["messagesv2"]
            })
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

    useEffect(() => {
        console.log(currentChat)
        console.log(messages?.pages[0]!.EntityArray.filter((message) => message.InstantMessageThreadId === currentChat)[0])
    }, [currentChat, messages?.pages]);

    const {mutate: sendFile, isLoading: isSendingFile} = usePOSTmessageAttachment({
        onError: (error) => {
            console.error(error)
        },
        onSuccess: (data) => {
            /* [
                {
                    "m_Item1": "98808916-0cda-4364-8095-5ef1b82241e8",
                    "m_Item2": "tree-736885_1280.jpg"
                }
            ] */
            console.log(data)
            const fileIds = data.map((file) => file.m_Item1)
            console.log(fileIds)
        }
    })


    const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement> | KeyboardEvent) => {
        event.preventDefault();
        if (message === '' && !files) return
        const isNewChat = currentChat === -1
        if (files !== null) {
            const interval = startSimulatedProgress()
            sendFile(files, {
                onSuccess: (data) => {
                    clearInterval(interval)
                    setUploadProgress(100)
                    sendMessage({
                        InstantMessageThreadId: currentChat !== undefined && currentChat !== -1 ? messages?.pages[0]!.EntityArray.filter((message) => message.InstantMessageThreadId === currentChat)[0].InstantMessageThreadId : undefined,
                        ToPersonIds: isNewChat ? recipientsSelected.map((recipient) => recipient.Id) : undefined,
                        SendAsIndividualMessages: isNewChat ? false : undefined,
                        // @ts-ignore
                        ReferencedInstantMessageType: isNewChat ? ItslearningRestApiEntitiesReferencedInstantMessageType[ItslearningRestApiEntitiesReferencedInstantMessageType.None] : undefined,
                        FileIds: data.map((file) => file.m_Item1)
                    }, {
                        onSuccess: () => {
                            if (message !== '') {
                                sendMessage({
                                    InstantMessageThreadId: currentChat !== undefined && currentChat !== -1 ? messages?.pages[0]!.EntityArray.filter((message) => message.InstantMessageThreadId === currentChat)[0].InstantMessageThreadId : undefined,
                                    ToPersonIds: isNewChat ? recipientsSelected.map((recipient) => recipient.Id) : undefined,
                                    SendAsIndividualMessages: isNewChat ? false : undefined,
                                    // @ts-ignore
                                    ReferencedInstantMessageType: isNewChat ? ItslearningRestApiEntitiesReferencedInstantMessageType[ItslearningRestApiEntitiesReferencedInstantMessageType.None] : undefined,
                                    Text: message,
                                })

                                setMessage('')
                                textareaRef.current!.style.height = "auto"
                                queryClient.invalidateQueries({
                                    queryKey: ["messagesv2"]
                                })
                                setRecipientsSelected([])
                                setFiles(null)
                            }
                        }
                    })
                }
            })
        } else {
            sendMessage({
                InstantMessageThreadId: currentChat !== undefined && currentChat !== -1 ? messages?.pages[0]!.EntityArray.filter((message) => message.InstantMessageThreadId === currentChat)[0].InstantMessageThreadId : undefined,
                ToPersonIds: isNewChat ? recipientsSelected.map((recipient) => recipient.Id) : undefined,
                SendAsIndividualMessages: isNewChat ? false : undefined,
                // @ts-ignore
                ReferencedInstantMessageType: isNewChat ? ItslearningRestApiEntitiesReferencedInstantMessageType[ItslearningRestApiEntitiesReferencedInstantMessageType.None] : undefined,
                Text: message
            })
        }
    }, [message, files, currentChat, startSimulatedProgress, sendFile, sendMessage, messages?.pages, recipientsSelected, queryClient, setRecipientsSelected])


    useEffect(() => {
        if (currentChat !== undefined && currentChat !== -1 && messages?.pages[0]!.EntityArray.filter((message) => message.InstantMessageThreadId === currentChat)[0].Messages.EntityArray.length) {
            chatRef.current?.scrollTo({
                top: chatRef.current?.scrollHeight,
                behavior: "instant",
            })
        }

        textareaRef.current?.focus()
    }, [currentChat, messages?.pages]);

    useEffect(() => {
        function handleSendShortcut(e: KeyboardEvent) {
            if (e.key === 'Enter' && e.ctrlKey) {
                handleSubmit(e)
            }
        }

        window.addEventListener('keydown', handleSendShortcut)

        return () => window.removeEventListener('keydown', handleSendShortcut)
    }, [handleSubmit])

    const {mutate: editThreadName, isLoading: isPendingThreadName} = usePUTinstantMessageThread({
        threadId: currentChat!
    }, {
        onSuccess: () => {
            toast({
                title: "Success",
                description: "Chat name changed",
                variant: "success",
                duration: 3000,
            })
            setNewThreadName('')
            setIsSettingNewThreadName(false)
            queryClient.invalidateQueries({
                queryKey: ["messagesv2"]
            })
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

    return (
        <div className="flex w-full h-full overflow-y-hidden flex-1">
            <div className="w-1/4 border-r overflow-y-hidden overflow-x-hidden">
                <MessagesSidebar
                    threadNames={messages!.pages[0]!.EntityArray.map((thread) => thread.Name || thread.Participants.filter((participant) => participant.PersonId !== user!.PersonId).map((participant) => participant.FullName).join(", "))}>
                    {currentChat === -1 && (
                        <div className={"animate-in slide-in-from-left-16"}>
                            <MessagesSidebarChat
                                title={"New chat"}
                                author={"Create a new chat"}
                                pictureUrl={"itsl-itslearning-file://icon.ico"}
                                id={-1}
                            />
                        </div>
                    )}
                    {messages?.pages[0]!.EntityArray.map((thread) => (
                        <MessagesSidebarChat
                            key={thread.InstantMessageThreadId}
                            title={thread.LastMessage.Text}
                            author={thread.Name || thread.Participants.filter((participant) => participant.PersonId !== user!.PersonId).map((participant) => participant.FullName).join(", ")}
                            pictureUrl={thread.LastMessage.CreatedByAvatar}
                            id={thread.InstantMessageThreadId}
                            canDelete={thread.CanDelete}
                        />
                    ))}
                </MessagesSidebar>
            </div>
            <div className="flex flex-col w-3/4">
                <MessagesChatHeader isSettingNewThreadName={isSettingNewThreadName}
                                    setIsSettingNewThreadName={setIsSettingNewThreadName} newThreadName={newThreadName}
                                    setNewThreadName={setNewThreadName} editThreadName={editThreadName}
                                    isPendingThreadName={isPendingThreadName} recipientsSelected={recipientsSelected}
                                    textareaRef={textareaRef} user={user}/>
                <div className="flex-1 p-4 overflow-x-hidden" ref={chatRef}>
                    {currentChat !== undefined && currentChat !== -1 && (
                        messages?.pages[0]!.EntityArray.filter((message) => message.InstantMessageThreadId === currentChat)[0].Messages.EntityArray.map((message) => (
                            <MessageChat me={user!.PersonId === message.CreatedBy}
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
                        ))
                    )}
                </div>
                {currentChat !== undefined && (
                    <MessagesChatInputsField files={files} setFiles={setFiles} isSendingFile={isSendingFile}
                                             uploadProgress={uploadProgress} textareaRef={textareaRef}
                                             handleSubmit={handleSubmit} isSendingMessage={isSendingMessage}
                                             message={message} setMessage={setMessage}/>
                )}
            </div>
        </div>
    )
}