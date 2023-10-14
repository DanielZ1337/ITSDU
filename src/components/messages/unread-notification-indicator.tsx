import React from "react";
import {cn} from "@/lib/utils";


interface UnreadNotificationIndicatorProps extends React.HTMLAttributes<HTMLSpanElement> {
    read: boolean
}

export const UnreadNotificationIndicator = React.forwardRef<HTMLSpanElement, UnreadNotificationIndicatorProps>((
        {
            read,
            className,
            ...props
        }, ref) => {
        return (
            <span
                className={cn("my-auto shrink-0 grow-0 w-1.5 h-2.5 rounded-full", read ? "bg-transparent" : "bg-secondary-500", className)}
                ref={ref}
                {...props}/>
        )
    }
)

UnreadNotificationIndicator.displayName = "UnreadNotificationIndicator"
