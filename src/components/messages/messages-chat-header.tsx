import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import MessagesAddRecipients from "@/components/messages/messages-add-recipients.tsx";
import {useAtom} from "jotai";
import {currentChatAtom} from "@/atoms/current-chat.ts";
import MessagesChatHeaderExistingChat from "@/components/messages/messages-chat-header-existing-chat.tsx";

export default function MessagesChatHeader({
                                               messages,
                                               isSettingNewThreadName,
                                               setIsSettingNewThreadName,
                                               newThreadName,
                                               setNewThreadName,
                                               editThreadName,
                                               isPendingThreadName,
                                               recipientsSelected,
                                               textareaRef,
                                               user,
                                           }: {
    messages?: any,
    isSettingNewThreadName: boolean,
    // eslint-disable-next-line no-unused-vars
    setIsSettingNewThreadName: (value: boolean) => void,
    newThreadName: string,
    // eslint-disable-next-line no-unused-vars
    setNewThreadName: (value: string) => void,
    // eslint-disable-next-line no-unused-vars
    editThreadName: (data: { InstantMessageThreadId: number, UpdateName: boolean, Name: string }) => void,
    isPendingThreadName: boolean,
    recipientsSelected: any[],
    textareaRef: any,
    user: any,
}) {

    const [currentChat] = useAtom(currentChatAtom)
    const isChatUndefined = currentChat === undefined
    const isChatNew = currentChat === -1

    return (
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
                    {!isChatUndefined && currentChat !== -1
                        // @ts-ignore
                        ? messages?.pages[0].EntityArray.filter((message) => message.InstantMessageThreadId === currentChat)[0].Name || messages?.pages[0].EntityArray.filter((message) => message.InstantMessageThreadId === currentChat)[0].Participants.filter((participant) => participant.PersonId !== user!.PersonId).map((participant) => participant.FullName).join(", ")
                        : currentChat === -1 && recipientsSelected.length === 0
                            ? "New chat" : recipientsSelected.length > 0
                                ? !isChatUndefined && "Select a chat" ? recipientsSelected.map((recipient) => recipient.SearchLabel).join(", ") : "Select a chat" : "Select a chat"
                    }
                </h2>
            )}
            {!isChatNew && !isChatUndefined && (
                <MessagesChatHeaderExistingChat
                    isSettingNewThreadName={isSettingNewThreadName}
                    setIsSettingNewThreadName={setIsSettingNewThreadName}
                />
            )}
            {isChatNew && (
                <MessagesAddRecipients textareaRef={textareaRef}/>
            )}
        </div>
    )
}