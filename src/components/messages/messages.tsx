import {Button} from "@/components/ui/button.tsx";
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
import {Textarea} from "@/components/ui/textarea"
import {useToast} from "@/components/ui/use-toast.ts";
import MessagesAddRecipients from "@/components/messages/messages-add-recipients.tsx";
import {messageSelectedRecipientsAtom} from "@/atoms/message-selected-recipients";
import {
    ItslearningRestApiEntitiesReferencedInstantMessageType
} from "@/types/api-types/utils/Itslearning.RestApi.Entities.ReferencedInstantMessageType.ts";
import usePUTinstantMessageThread from "@/queries/messages/usePUTinstantMessageThread.ts";
import {Input} from "@/components/ui/input.tsx";


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

    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const chatRef = useRef<HTMLDivElement>(null)
    const [recipientsSelected, setRecipientsSelected] = useAtom(messageSelectedRecipientsAtom)

    const {mutate: sendMessage, isLoading: isSendingMessage} = usePOSTinstantMessagev2({
        InstantMessageThreadId: currentChat !== undefined && currentChat !== -1 ? messages?.pages[0]!.EntityArray.filter((message) => message.InstantMessageThreadId === currentChat)[0].InstantMessageThreadId : undefined,
        ToPersonIds: currentChat === -1 ? recipientsSelected.map((recipient) => recipient.Id) : undefined,
        SendAsIndividualMessages: currentChat === -1 ? false : undefined,
        // @ts-ignore
        ReferencedInstantMessageType: currentChat === -1 ? ItslearningRestApiEntitiesReferencedInstantMessageType[ItslearningRestApiEntitiesReferencedInstantMessageType.None] : undefined,
        Text: message,
    }, {
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


    const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement> | KeyboardEvent) => {
        event.preventDefault();
        if (message === '') return
        const isNewChat = currentChat === -1
        sendMessage({
            InstantMessageThreadId: isNewChat ? undefined : messages?.pages[0]!.EntityArray.filter((message) => message.InstantMessageThreadId === currentChat)[0].InstantMessageThreadId,
            ToPersonIds: isNewChat ? recipientsSelected.map((recipient) => recipient.Id) : undefined,
            SendAsIndividualMessages: isNewChat ? false : undefined,
            // @ts-ignore
            ReferencedInstantMessageType: isNewChat ? ItslearningRestApiEntitiesReferencedInstantMessageType[ItslearningRestApiEntitiesReferencedInstantMessageType.None] : undefined,
            Text: message,
        })
    }, [message, currentChat, sendMessage, messages?.pages, recipientsSelected])


    useEffect(() => {
        if (currentChat !== undefined && currentChat !== -1 && messages?.pages[0]!.EntityArray.filter((message) => message.InstantMessageThreadId === currentChat)[0].Messages.EntityArray.length) {
            chatRef.current?.scrollTo({
                top: chatRef.current?.scrollHeight,
                behavior: "smooth",
            })
        }
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

    const {mutate: editThreadName, isLoading:isPendingThreadName} = usePUTinstantMessageThread({
        threadId: currentChat!
    }, {
        UpdateName: true,
        Name: newThreadName,
        InstantMessageThreadId: currentChat!,
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
                <MessagesSidebar>
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
                <div className="p-4 border-b flex items-center justify-between min-h-[5rem]">
                    {isSettingNewThreadName ? (
                        <form className={"flex items-center space-x-2"} onSubmit={(e) => {
                            e.preventDefault()
                            editThreadName({
                                InstantMessageThreadId: currentChat!,
                                UpdateName: true,
                                Name: newThreadName,
                            })
                        }}>
                            <Input value={newThreadName} onChange={(e) => setNewThreadName(e.target.value)}/>
                            <Button disabled={newThreadName === '' || isPendingThreadName}>
                                {isPendingThreadName ? "Saving..." : "Save"}
                            </Button>
                        </form>
                    ) : (
                        <h2 className="font-semibold text-lg">
                            {currentChat !== undefined && currentChat !== -1
                                // include name
                                ? messages?.pages[0]!.EntityArray.filter((message) => message.InstantMessageThreadId === currentChat)[0].Name || messages?.pages[0]!.EntityArray.filter((message) => message.InstantMessageThreadId === currentChat)[0].Participants.filter((participant) => participant.PersonId !== user!.PersonId).map((participant) => participant.FullName).join(", ")!
                                : currentChat === -1 && recipientsSelected.length === 0
                                    ? "New chat" : recipientsSelected.length > 0
                                        ? recipientsSelected.map((recipient) => recipient.SearchLabel).join(", ") : "Select a chat"
                            }
                        </h2>
                    )}
                    {currentChat !== undefined && currentChat !== -1 && (
                        <div className={"flex space-x-2"}>
                            <Button variant={"outline"} type="button">
                                Other Actions
                            </Button>
                            <Button variant={"outline"} type="button"
                                    onClick={() => setIsSettingNewThreadName(!isSettingNewThreadName)}>
                                {isSettingNewThreadName ? "Cancel" : "Edit name"}
                            </Button>
                        </div>
                    )}
                    {currentChat !== undefined && currentChat === -1 && (
                        <MessagesAddRecipients textareaRef={textareaRef}/>
                    )}
                </div>
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
                            />
                        ))
                    )}
                </div>
                {currentChat !== undefined && (
                    <div className="p-4 border-t max-h-64">
                        <form className="flex items-center" onSubmit={handleSubmit}>
                            <Textarea rows={1} className="w-full mr-2 min-h-[2.5rem] max-h-48 overflow-hidden"
                                      ref={textareaRef}
                                      onInput={(e) => {
                                          // resize textarea
                                          e.currentTarget.style.height = "auto"
                                          e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`
                                      }}
                                      value={message}
                                      onChange={(e) => setMessage(e.target.value)}
                                      placeholder="Type your message..."/>
                            <Button variant={"outline"}
                                    className="rounded-full" type="submit"
                                    disabled={isSendingMessage}
                            >
                                {isSendingMessage ? "Sending..." : "Send"}
                            </Button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    )
}