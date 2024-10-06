import { Separator } from "@/components/ui/separator.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { cn } from "@/lib/utils.ts";
import { UnreadNotificationIndicator } from "../../unread-notification-indicator.tsx";

export default function MessagesDropdownFallback({
  hideSeparator,
}: { hideSeparator?: boolean }) {
  return (
    <>
      <div className={"flex gap-2 items-center justify-center w-full"}>
        {/* <span
                    className="-ml-1 shrink-0 grow-0 rounded-full bg-primary w-1.5 h-2.5"></span> */}
        <UnreadNotificationIndicator />
        <div className="w-full space-y-2">
          <div className="flex h-8 w-full items-center justify-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-full" />
          </div>
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
      <Separator className={cn("my-2", hideSeparator && "hidden")} />
    </>
  );
}
