import {Separator} from "@/components/ui/separator.tsx";
import {AlertCircle} from "lucide-react";

export default function NotificationsDropdownInfiniteEnd() {
    return (
        <>
            <Separator
                className={"my-2"}/>
            <div className="flex flex-col items-center justify-center py-6 h-32 w-full">
                <AlertCircle className={"stroke-destructive shrink-0"}/>
                <h3 className="text-foreground font-medium text-xl mt-4">
                    No more notifications
                </h3>
                <p className="text-muted-foreground text-center px-6">
                    You have reached the end of your notifications.
                </p>
            </div>
        </>
    )
}