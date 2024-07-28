import {cn} from "@/lib/utils";
import React from "react";

export default function LightbulletinLink({className, children, ...props}: {
    className?: string,
    children?: React.ReactNode
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            className={cn("hover:cursor-pointer hover:bg-foreground/5 py-2 px-2 hover:border-transparent border border-foreground/10 rounded-lg group/attachment", className)}
            {...props}
        >
            <div
                className="flex items-center p-2 text-blue-500 group-hover/attachment:text-blue-600 space-x-2 font-semibold">
                {children}
            </div>
        </button>
    )
}
