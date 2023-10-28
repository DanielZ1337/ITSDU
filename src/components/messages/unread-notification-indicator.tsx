import React from "react";
import {cn} from "@/lib/utils";


interface UnreadNotificationIndicatorProps extends React.HTMLAttributes<HTMLSpanElement> {
    read: boolean
    ping?: boolean
}

export const UnreadNotificationIndicator = React.forwardRef<HTMLSpanElement, UnreadNotificationIndicatorProps>(({
                                                                                                                    read,
                                                                                                                    ping,
                                                                                                                    className,
                                                                                                                    ...props
                                                                                                                }, ref) => {
    return (
        <div className="flex my-auto relative">
            <span
                className={cn("m-auto shrink-0 grow-0 w-1.5 h-2.5 rounded-full", read ? "bg-transparent" : "bg-secondary-500", className)}
                ref={ref}
                {...props} />
            {ping && (
                <span
                    className={cn("animate-ping absolute m-auto shrink-0 grow-0 w-1.5 h-2.5 rounded-full", read ? "bg-transparent" : "bg-secondary-500", className)}
                    ref={ref}
                    {...props} />
            )}
        </div>
    )
})

UnreadNotificationIndicator.displayName = "UnreadNotificationIndicator"
