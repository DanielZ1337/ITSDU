import {Separator} from "@/components/ui/separator.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";

export default function NotificationsDropdownInfiniteFallback() {
    return (
        <>
            <Separator
                className={"my-2"}/>
            <div className="flex flex-col items-center justify-center py-6 h-32 w-full">
                <Skeleton className={"w-8 h-8 rounded-full shrink-0"}/>
                <h3 className="text-foreground font-medium text-xl mt-4">
                    Loading
                </h3>
                <p className="text-muted-foreground text-center px-6">
                    Loading more notifications...
                </p>
            </div>
        </>
    )
}