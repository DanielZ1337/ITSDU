import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function MessagesOtherActionsDropdown() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger className="group" asChild>
                <Button variant="outline" className="ml-auto select-none capitalize">
                    Other Actions <ChevronDown
                        className="ml-2 h-4 w-4 transform transition-all group-data-[state=open]:rotate-180" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-2">
                <DropdownMenuItem disabled>Add participants</DropdownMenuItem>
                <DropdownMenuItem disabled>See participants</DropdownMenuItem>
                <DropdownMenuItem disabled>Mark as unread</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="hover:!bg-destructive" disabled>Leave chat</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

    )
}

/**
 * const { data: messages, isLoading } = useGETinstantMessageThread({
        threadId: currentChat!,
        maxMessages: 1,
    }, {
        enabled: isChatExisting,
    })

    const participants = messages?.Participants.reduce((acc, participant) => [...acc, participant.PersonId], [] as number[]);
 */
