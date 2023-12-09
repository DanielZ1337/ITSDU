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
import { useUser } from "@/hooks/atoms/useUser.ts";
import MessageTitleForm from "./messages-title-form";
import { messageSelectedRecipientsAtom } from "@/atoms/message-selected-recipients";

export default function MessagesChatHeader({ isChatNew, isChatUndefined, disabledInputsField }: {
    isChatNew: boolean,
    isChatUndefined: boolean,
    disabledInputsField?: boolean,
}) {
    const [isSettingNewThreadName, setIsSettingNewThreadName] = useState<boolean>(false);
    const [recipientsSelected] = useAtom(messageSelectedRecipientsAtom)

    return (
        <div className="flex w-full items-center justify-between border-b p-4 min-h-[5rem]">
            <MessageTitleForm isChatNew={isChatNew} isChatUndefined={isChatUndefined} recipientsSelected={recipientsSelected}
                setIsSettingNewThreadName={setIsSettingNewThreadName} isSettingNewThreadName={isSettingNewThreadName}
            />
            {!disabledInputsField && (
                <div
                    className="flex-shrink-0"
                >
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
            )}
        </div>
    )
}