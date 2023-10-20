import {useParams} from "react-router-dom";
import {Suspense} from "react";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {PersonRelationships} from "@/components/person/person-relationships.tsx";
import {PersonInfo} from "@/components/person/person-info.tsx";

export default function PersonIndex() {
    const params = useParams();
    const personId = Number(params.id)

    /*
    * {
    "PersonId": 475690,
    "FirstName": "Smith",
    "LastName": "Khare",
    "FullName": "Smith Khare",
    "ProfileUrl": "https://sdu.itslearning.com/person/show_person.aspx?personid=475690",
    "AdditionalInfo": "smkh@mmmi.sdu.dk",
    "ProfileImageUrl": "https://filerepository.itslearning.com/c42c9665-ed6d-4a9a-8cc9-e0944147ca63",
    "ProfileImageUrlSmall": "https://filerepository.itslearning.com/7bc471ee-0e33-4b91-9526-efe1f79e27e3"
}
    * */

    return (
        <div className="flex items-center justify-center flex-1 p-4">
            <div
                className="bg-foreground/10 shadow-lg shadow-foreground/5 rounded-lg overflow-hidden p-8 flex flex-col">
                <Suspense fallback={
                    <div className={"flex flex-col gap-4 w-full p-4 items-center"}>
                        <div className="px-4 py-2 space-y-4">
                            <Skeleton className={"min-w-[40dvw] w-full h-4"}/>
                            <Skeleton className={"mx-auto min-w-[30dvw] w-1/3 h-4"}/>
                        </div>
                        <Skeleton className={"h-32 w-32 rounded-full"}/>
                    </div>
                }>
                    <PersonInfo personId={personId}/>
                </Suspense>
                <div className={"h-0.5 w-full bg-foreground/10 my-6"}/>
                <Suspense fallback={
                    <div className={"flex flex-col gap-4 w-full p-4 items-center"}>
                        <Skeleton className={"min-w-[40dvw] w-full h-4"}/>
                        <Skeleton className={"min-w-[40dvw] w-full h-4"}/>
                        <Skeleton className={"min-w-[40dvw] w-full h-4"}/>
                    </div>
                }>
                    <PersonRelationships personId={personId}/>
                </Suspense>
            </div>
        </div>
    )
}