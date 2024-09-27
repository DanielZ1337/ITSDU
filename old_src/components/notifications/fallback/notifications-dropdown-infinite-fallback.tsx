import {Separator} from "@/components/ui/separator.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";

export default function NotificationsDropdownInfiniteFallback() {
    return (
        <>
            <Separator
                className={"my-2"}/>
            <div className="flex h-32 w-full flex-col items-center justify-center py-6">
                <Skeleton className={"w-8 h-8 rounded-full shrink-0"}/>
                <h3 className="mt-4 text-xl font-medium text-foreground">
                    Loading
                </h3>
                <p className="px-6 text-center text-muted-foreground">
                    Loading more notifications...
                </p>
            </div>
        </>
    )
}