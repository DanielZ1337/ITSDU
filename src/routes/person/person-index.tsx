import useGETperson from "@/queries/person/useGETperson.ts";
import {useParams} from "react-router-dom";
import useGETpersonsRelations from "@/queries/person/useGETpersonsRelations.ts";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";

export default function PersonIndex() {
    const params = useParams();
    const personId = Number(params.id)
    const {data: relations} = useGETpersonsRelations({
        personId
    }, {
        suspense: true,
    })

    const {data: person} = useGETperson({
        personId
    }, {
        suspense: true,
    })

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

    if (!personId || !person || !relations) {
        return (
            <div className={"m-auto"}>
                <div className={"flex flex-col gap-4 w-full p-4 items-center"}>
                    <p className={"text-3xl font-bold text-balance"}>Person not found</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center flex-1 p-4">
            <div className="bg-foreground/10 shadow-lg shadow-foreground/5 rounded-lg overflow-hidden p-8 flex flex-col">
                <div>
                    <div className="px-4 py-2">
                        <h1 className="font-bold text-3xl text-balance text-center">{person.FullName}</h1>
                        {/*@ts-ignore*/}
                        <p className="text-foreground/50 text-sm mt-1 text-balance text-center">{person.AdditionalInfo}</p>
                    </div>
                    <Avatar className={"flex-shrink-0 w-32 h-32 border-4 mx-auto"}>
                        <AvatarImage src={person.ProfileImageUrl}
                                     alt={person.FullName}
                                     className={"object-cover"}
                        />
                        <AvatarFallback className={"bg-foreground/20"}>
                            {person.FullName.split(" ").map((name) => name[0]).join("").slice(0, 3)}
                        </AvatarFallback>
                    </Avatar>
                </div>
                <div className={"h-0.5 w-full bg-foreground/10 my-6"}/>
                <div className="px-4 py-2">
                    <h1 className="text-foreground font-bold text-2xl">Your relationships</h1>
                    <p className="text-foreground text-sm mt-1 space-y-2">
                        {relations.map((relation) => (
                            <p className={"text-balance"}>{relation.Text}</p>
                        ))}
                    </p>
                </div>
            </div>
        </div>
    )
}