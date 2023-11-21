import {HoverCard, HoverCardContent, HoverCardTrigger} from "@/components/ui/hover-card.tsx";
import React, {Suspense} from "react";
import {PersonRelationships} from "@/components/person/person-relationships.tsx";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";

export default function PersonHoverCard({children, personId, showTitle, asChild}: {
    children: React.ReactNode
    personId: number
    showTitle?: boolean
    asChild?: boolean
}) {
    return (
        <HoverCard>
            <HoverCardTrigger asChild={asChild}>
                {children}
            </HoverCardTrigger>
            <HoverCardContent className={"min-w-[20rem] max-w-[60dvw] w-fit break-all"}>
                <Suspense fallback={<div className="font-semibold text-base">Loading...</div>}>
                    <ScrollArea className={"max-h-[33vh] overflow-y-auto"}>
                        <PersonRelationships personId={personId} showTitle={showTitle}/>
                    </ScrollArea>
                </Suspense>
            </HoverCardContent>
        </HoverCard>
    )
}