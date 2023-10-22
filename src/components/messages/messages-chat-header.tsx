import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import MessagesAddRecipients from "@/components/messages/messages-add-recipients.tsx";
import { useAtom } from "jotai";
import { currentChatAtom, currentChatEnum } from '@/atoms/current-chat.ts';
import MessagesChatHeaderExistingChat from "@/components/messages/messages-chat-header-existing-chat.tsx";
import usePUTinstantMessageThread from "@/queries/messages/usePUTinstantMessageThread";
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from "../ui/use-toast";
import { useState } from "react";
import {
    ItslearningRestApiEntitiesInstantMessageRecipient
} from "@/types/api-types/utils/Itslearning.RestApi.Entities.InstantMessageRecipient.ts";
import useGETinstantMessagesv2 from "@/queries/messages/useGETinstantMessagesv2";
import { useUser } from "@/atoms/user";

export default function MessagesChatHeader({
    recipientsSelected,
}: {
    recipientsSelected: ItslearningRestApiEntitiesInstantMessageRecipient[],
}) {

    const [currentChat] = useAtom(currentChatAtom)
    const isChatUndefined = currentChat === currentChatEnum.NONE
    const isChatNew = currentChat === currentChatEnum.NEW
    const queryClient = useQueryClient()
    const { toast } = useToast()
    const [newThreadName, setNewThreadName] = useState<string>('')
    const [isSettingNewThreadName, setIsSettingNewThreadName] = useState<boolean>(false)

    const { data: messages, isLoading } = useGETinstantMessagesv2({
        maxMessages: 1,
        threadPage: 0,
        maxThreadCount: 10,
    }, {
        enabled: !isChatNew && !isChatUndefined,
    })
    const user = useUser()
    let currentThreadName

    if (!isLoading) {
        currentThreadName = messages?.pages.map((page) => page.EntityArray).flat().filter((thread) => thread.InstantMessageThreadId === currentChat)[0]?.Name || messages!.pages[0]!.EntityArray.filter((message) => message.InstantMessageThreadId === currentChat)[0]?.Participants.filter((participant) => participant.PersonId !== user!.PersonId).map((participant) => participant.FullName).join(", ")
    }

    const { mutate: editThreadName, isLoading: isPendingThreadName } = usePUTinstantMessageThread({
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
        <div className="p-4 border-b flex items-center justify-between min-h-[5rem] w-full">
            {!isChatNew && !isChatUndefined && isSettingNewThreadName ? (
                <form className={"flex items-center space-x-2"} onSubmit={(e) => {
                    e.preventDefault()
                    editThreadName({
                        InstantMessageThreadId: currentChat!,
                        UpdateName: true,
                        Name: newThreadName,
                    })
                }}>
                    <Input value={newThreadName} onChange={(e) => setNewThreadName(e.target.value)} />
                    <Button disabled={newThreadName === '' || isPendingThreadName}>
                        {isPendingThreadName ? "Saving..." : "Save"}
                    </Button>
                </form>
            ) : (
                <h2 className="font-semibold text-lg">
                    {isChatNew && !recipientsSelected && "New chat"}
                    {isChatNew && recipientsSelected && "New chat with " + recipientsSelected.map((recipient) => recipient.Label).join(", ")}
                    {!isChatNew && !isChatUndefined && isLoading ? "Loading..." : currentThreadName}
                    {isChatUndefined && "Select a chat"}
                </h2>
            )}
            {!isChatNew && !isChatUndefined && (
                <MessagesChatHeaderExistingChat
                    isSettingNewThreadName={isSettingNewThreadName}
                    setIsSettingNewThreadName={setIsSettingNewThreadName}
                />
            )}
            {isChatNew && (
                <MessagesAddRecipients />
            )}
        </div>
    )
}