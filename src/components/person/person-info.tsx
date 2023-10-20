import useGETperson from "@/queries/person/useGETperson.ts";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";

export function PersonInfo({personId}: { personId: number }) {
    const {data: person} = useGETperson({
        personId
    }, {
        suspense: true,
    })

    if (!personId || !person) {
        return (
            <div className={"m-auto"}>
                <div className={"flex flex-col gap-4 w-full p-4 items-center"}>
                    <p className={"text-3xl font-bold text-balance"}>Person not found</p>
                </div>
            </div>
        )
    }

    return (
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
    )
}