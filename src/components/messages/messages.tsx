import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button.tsx";
import useGETinstantMessagesv2 from "@/queries/messages/useGETinstantMessagesv2.ts";
import MessageChat from "@/components/messages/message-chat.tsx";
import useGETcurrentUser from "@/queries/person/useGETcurrentUser.ts";
import {useEffect, useState} from "react";
import MessagesSidebarChat from "@/components/messages/messages-sidebar-chat.tsx";
import usePOSTinstantMessagev2 from "@/queries/messages/usePOSTinstantMessagev2.ts";


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

    const [currentChat, setCurrentChat] = useState<number | undefined>()
    const [message, setMessage] = useState<string>('')

    const {mutate, isLoading: isSendingMessage} = usePOSTinstantMessagev2({
        InstantMessageThreadId: currentChat !== undefined ? messages?.pages[0]!.EntityArray[currentChat].InstantMessageThreadId! : undefined,
        Text: message,
    }, {
        onSuccess: () => {
            setMessage('')
        },
        onError: (error) => {
            console.log(error)
        },
    })

    useEffect(() => {
        console.log(currentChat)
    }, [currentChat]);

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        console.log(message)
        console.log(currentChat !== undefined && messages?.pages[0]!.EntityArray[currentChat!].InstantMessageThreadId)
        mutate({
            InstantMessageThreadId: currentChat && messages?.pages[0]!.EntityArray[currentChat!].InstantMessageThreadId,
            Text: message,
        })
    }

    return (
        <div className="flex w-full h-full overflow-y-hidden flex-1">
            <div className="w-1/4 border-r overflow-y-auto overflow-x-hidden">
                {messages?.pages[0]!.EntityArray.map((message, idx) => (
                    <MessagesSidebarChat
                        key={message.InstantMessageThreadId}
                        title={message.LastMessage.Text}
                        author={message.LastMessage.CreatedByShortName}
                        pictureUrl={message.LastMessage.CreatedByAvatar}
                        setCurrentChat={() => setCurrentChat(idx)}
                    />
                ))}
            </div>
            <div className="flex flex-col w-3/4">
                <div className="p-4 border-b flex items-center justify-between">
                    <h2 className="font-semibold text-lg">Thread 1</h2>
                    <Button variant={"outline"} type="button">
                        Other Actions
                    </Button>
                </div>
                <div className="flex-1 p-4 overflow-auto">
                    {currentChat !== undefined && (
                        messages?.pages[0]!.EntityArray[currentChat].Messages.EntityArray.map((message) => (
                            <MessageChat me={user!.PersonId === message.CreatedBy} pictureUrl={message.CreatedByAvatar}
                                         messageText={message.Text}
                                         author={message.CreatedByName} time={message.Created}
                                         edited={message.IsEdited}
                            />
                        ))
                    )}
                </div>
                <div className="p-4 border-t">
                    <form className="flex items-center" onSubmit={handleSubmit}>
                        <Input className="w-full mr-2 h-8"
                               value={message}
                               onChange={(e) => setMessage(e.target.value)}
                               placeholder="Type your message..." type="text"/>
                        <Button variant={"outline"}
                                className="px-3 py-2 text-white rounded-md h-8 text-center" type="submit"
                                disabled={isSendingMessage}
                        >
                            {isSendingMessage ? "Sending..." : "Send"}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}