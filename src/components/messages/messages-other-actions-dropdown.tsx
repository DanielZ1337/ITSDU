import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
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
                <Button variant="outline" className="capitalize ml-auto select-none">
                    Other Actions <ChevronDown className="ml-2 h-4 w-4 transform transition-all group-data-[state=open]:rotate-180" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-2">
                <DropdownMenuItem>Add participants</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

    )
}
