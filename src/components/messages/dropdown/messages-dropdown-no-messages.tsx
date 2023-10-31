import {AlertCircle} from "lucide-react";

export default function MessagesDropdownNoMessages() {
    return (
        <div className="flex flex-col items-center justify-center py-6 h-72 w-full">
            <AlertCircle className={"stroke-destructive"}/>
            <h3 className="text-foreground font-medium text-xl mt-4">
                No messages
            </h3>
            <p className="text-muted-foreground text-center px-6">
                You currently don&apos;t have any messages.
            </p>
        </div>
    )
}