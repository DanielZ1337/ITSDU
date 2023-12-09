import React, { useState } from 'react'
import { useToast } from '../ui/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import useGETinstantMessagesv2 from '@/queries/messages/useGETinstantMessagesv2';
import { useUser } from '@/hooks/atoms/useUser';
import usePUTinstantMessageThread from '@/queries/messages/usePUTinstantMessageThread';
import { useAtom } from 'jotai';
import { currentChatAtom } from '@/atoms/current-chat';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { ItslearningRestApiEntitiesInstantMessageRecipient } from '@/types/api-types/utils/Itslearning.RestApi.Entities.InstantMessageRecipient';
import { Helmet } from 'react-helmet-async';

export default function MessageTitleForm({ isChatNew, isChatUndefined, recipientsSelected, setIsSettingNewThreadName, isSettingNewThreadName }: {
    isChatNew: boolean,
    isChatUndefined: boolean,
    recipientsSelected: ItslearningRestApiEntitiesInstantMessageRecipient[],
    setIsSettingNewThreadName: any,
    isSettingNewThreadName: boolean,
}) {

    const [currentChat] = useAtom(currentChatAtom);
    const { toast } = useToast();
    const user = useUser();
    const queryClient = useQueryClient();
    const [newThreadName, setNewThreadName] = useState<string>('');

    const { data: messages, isLoading } = useGETinstantMessagesv2({
        maxMessages: 1,
        threadPage: 0,
        maxThreadCount: 10,
    }, {
        enabled: !isChatNew && !isChatUndefined,
    });

    let currentThreadName: string;

    if (!isLoading) {
        currentThreadName =
            messages?.pages
                .map((page) => page.EntityArray)
                .flat()
                .filter((thread) => thread.InstantMessageThreadId === currentChat)[0]?.Name ||
            messages!.pages!.flatMap((page) => page.EntityArray)
                .filter((message) => message.InstantMessageThreadId === currentChat)[0]?.Participants
                .filter((participant) => participant.PersonId !== user!.PersonId)
                .map((participant) => participant.FullName)
                .join(', ');
    }

    const { mutate: editThreadName, isLoading: isLoadingThreadName } = usePUTinstantMessageThread(
        {
            threadId: currentChat!,
        },
        {
            onSuccess: () => {
                toast({
                    title: 'Success',
                    description: 'Chat name changed',
                    variant: 'success',
                    duration: 3000,
                });
                setNewThreadName('');
                setIsSettingNewThreadName(false);
                queryClient.invalidateQueries({
                    queryKey: ['messagesv2'],
                });
            },
            onError: (error) => {
                toast({
                    title: 'Error',
                    description: error.message,
                    variant: 'destructive',
                    duration: 3000,
                });
            },
        }
    );

    function handleTreadNameSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (newThreadName === '') return;
        if (isLoadingThreadName) return;
        if (!currentChat) return;
        editThreadName({
            InstantMessageThreadId: currentChat,
            UpdateName: true,
            Name: newThreadName,
        });
    }

    const MessagesHeaderTitleString = () => {
        if (isChatNew && !recipientsSelected) return "New chat";
        if (isChatNew && recipientsSelected) return "New chat with " + recipientsSelected.map((recipient) => recipient.Label).join(", ");
        if (!isChatNew && !isChatUndefined && isLoading) return "Loading...";
        if (!isChatNew && !isChatUndefined && !isLoading) return currentThreadName;
        if (isChatUndefined) return "Select a chat";
    }

    return (
        <>
            <Helmet>
                <title>
                    {MessagesHeaderTitleString()}
                </title>
            </Helmet>
            {!isChatNew && !isChatUndefined && isSettingNewThreadName ? (
                <form className={"flex items-center space-x-2"} onSubmit={handleTreadNameSubmit}>
                    <Input value={newThreadName} onChange={(e) => setNewThreadName(e.target.value)} />
                    <Button disabled={newThreadName === '' || isLoadingThreadName}>
                        {isLoadingThreadName ? "Saving..." : "Save"}
                    </Button>
                </form>
            ) : (
                <h2 className="text-lg font-semibold truncate">
                    {MessagesHeaderTitleString()}
                </h2>
            )}
        </>
    )
}
