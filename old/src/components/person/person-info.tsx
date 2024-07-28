import useGETperson from "@/queries/person/useGETperson.ts";
import ProfileAvatar from "../profile-avatar";

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
                <h1 className="text-center text-3xl font-bold text-balance">{person.FullName}</h1>
                {/*@ts-ignore*/}
                <p className="mt-1 text-center text-sm text-foreground/50 text-balance">{person.AdditionalInfo}</p>
            </div>
            <ProfileAvatar
                src={person.ProfileImageUrl}
                name={person.FullName}
                className={"w-32 h-32 border-4 mx-auto border-primary/20"}
                classNameFallbackAvatar="w-full h-full"
                classNameFallback={"bg-foreground/20"}
            />
        </div>
    )
}