import useGETlightbulletinAllComments from "@/queries/lightbulletin/useGETlightbulletinAllComments.ts";
import LightbulletinComment from "@/components/lightbulletin/lightbulletin-comment.tsx";

export default function LightbulletinComments({lightbulletinId}: {
    lightbulletinId: number
}) {
    const {data} = useGETlightbulletinAllComments({
        lightBulletinId: lightbulletinId,
    }, {
        suspense: true,
    })

    if (data!.EntityArray.length === 0) {
        return (
            <div className={"flex flex-col w-full h-full p-4 justify-center items-center"}>
                <span
                    className={"text-gray-500 flex gap-2 items-center justify-center text-sm sm:text-base md:text-lg font-semibold tracking-tighter"}>
                    No comments
                </span>
            </div>
        )
    }

    return (
        <>
            <div className="h-0.5 w-full bg-foreground/10"/>
            <div className="pt-4 flex flex-col gap-4">
                {data!.EntityArray.map((comment) => (
                    <LightbulletinComment comment={comment} key={comment.Id}/>
                ))}
            </div>
        </>
    )
}