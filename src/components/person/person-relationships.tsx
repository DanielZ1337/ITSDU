import useGETpersonsRelations from "@/queries/person/useGETpersonsRelations.ts";

export function PersonRelationships({ personId, showTitle = true }: { personId: number, showTitle?: boolean }) {
    const { data: relations } = useGETpersonsRelations({
        personId
    }, {
        suspense: true,
    })

    if (!relations) {
        return (
            <div className={"m-auto"}>
                <div className={"flex flex-col gap-4 w-full p-4 items-center"}>
                    <p className={"font-semibold text-foreground/50 text-balance"}>No relationships found</p>
                </div>
            </div>
        )
    }

    return (
        <div className="px-4 py-2">
            {showTitle && <h2 className="font-bold text-2xl text-balance text-foreground">Your relationships</h2>}
            <p className="text-foreground text-sm mt-1 space-y-4">
                {relations.map((relation, idx) => (
                    <ul key={idx} className={"text-balance"}>
                        {relation.Text}
                        {relation.Items?.map((item, idx) => (
                            <li className={"text-foreground/50 my-1 font-normal"} key={idx}>{item}</li>
                        ))}
                    </ul>
                ))}
            </p>
        </div>
    )
}