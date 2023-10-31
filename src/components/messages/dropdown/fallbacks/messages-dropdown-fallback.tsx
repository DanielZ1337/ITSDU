import {Separator} from "@/components/ui/separator.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {cn} from "@/lib/utils.ts";
import {UnreadNotificationIndicator} from "../../unread-notification-indicator.tsx";

export default function MessagesDropdownFallback({hideSeparator}: { hideSeparator?: boolean }) {
    return (
        <>
            <div className={"flex gap-2 items-center justify-center w-full"}>
                {/* <span
                    className="-ml-1 bg-primary shrink-0 grow-0 w-1.5 h-2.5 rounded-full"></span> */}
                <UnreadNotificationIndicator/>
                <div className="space-y-2 w-full">
                    <div
                        className="h-8 w-full flex justify-center items-center gap-2">
                        <Skeleton className="h-8 w-8 rounded-full"/>
                        <Skeleton className="h-4 w-full"/>
                    </div>
                    <Skeleton className="h-4 w-full"/>
                </div>
            </div>
            <Separator
                className={cn("my-2", hideSeparator && "hidden")}/>
        </>
    )
}