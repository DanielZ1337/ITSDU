import {HoverCard, HoverCardContent, HoverCardTrigger} from "@/components/ui/hover-card";
import {cn, getRelativeTimeString} from "@/lib/utils";

export default function HoverDate({date, children, className}: {
    date: Date | string,
    children?: React.ReactNode,
    className?: string
}) {
    return (
        <HoverCard>
            <HoverCardTrigger asChild>
                <span className={cn("text-gray-500", className)}>
                    {children || getRelativeTimeString(new Date(date))}
                </span>
            </HoverCardTrigger>
            <HoverCardContent className={"max-w-[60dvw] w-fit break-all py-2 border-0 px-4"}>
                {new Date(date).toLocaleDateString(undefined, {
                    month: "long",
                    day: "numeric", ...(new Date(date).getFullYear() !== new Date().getFullYear() && {year: "numeric"})
                })} at {new Date(date).toLocaleTimeString(undefined, {
                hour: "numeric",
                minute: "numeric"
            })} ({getRelativeTimeString(new Date(date))})
            </HoverCardContent>
        </HoverCard>
    )
}