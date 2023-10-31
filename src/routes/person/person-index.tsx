import {useParams} from "react-router-dom";
import {Suspense} from "react";
import {PersonRelationships} from "@/components/person/person-relationships.tsx";
import {PersonInfo} from "@/components/person/person-info.tsx";
import PersonRelationshipsListFallback from "@/components/person/fallback/person-relationships-list-fallback";
import PersonRelationshipsPersonInfoFallback
    from "@/components/person/fallback/person-relationships-person-info-fallback";

export default function PersonIndex() {
    const params = useParams();
    const personId = Number(params.id)

    return (
        <div className="flex items-center justify-center flex-1 p-4">
            <div
                className="bg-foreground/10 shadow-lg shadow-foreground/5 rounded-lg overflow-hidden p-8 flex flex-col">
                <Suspense fallback={<PersonRelationshipsPersonInfoFallback/>}>
                    <PersonInfo personId={personId}/>
                </Suspense>
                <div className={"h-0.5 w-full bg-foreground/10 my-6"}/>
                <Suspense fallback={<PersonRelationshipsListFallback/>}>
                    <PersonRelationships personId={personId}/>
                </Suspense>
            </div>
        </div>
    )
}