import {HoverCard, HoverCardContent, HoverCardTrigger} from "@/components/ui/hover-card";
import {getRelativeTimeString} from "@/lib/utils";

export default function LightbulletinDate({date}: { date: Date }) {
    return (
        <HoverCard>
            <HoverCardTrigger asChild>
                <span className="text-gray-500">
                    {getRelativeTimeString(new Date(date))}
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