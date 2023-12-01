import useGETlightbulletinsForCourse from "@/queries/lightbulletin-course/useGETlightbulletinsForCourse.ts";
import LightbulletinCard from "@/components/lightbulletin/lightbulletin-card.tsx";
import * as linkify from 'linkifyjs';

export default function LightbulletinsForCourse({ courseId }: {
    courseId: number
}) {

    const { data } = useGETlightbulletinsForCourse({
        courseId: courseId
    }, {
        suspense: true,
    })

    return (
        <div className={"grid grid-cols-1 gap-6 p-4"}>
            {data!.EntityArray.map((bulletin, idx) => {
                // find the date of the previous bulletin and compare it to the current one. When the month is different make a new header
                const previousBulletin = data!.EntityArray[idx - 1]
                const previousBulletinDate = previousBulletin ? new Date(previousBulletin.PublishedDate) : null
                const currentBulletinDate = new Date(bulletin.PublishedDate)
                const hasNextBulletin = data!.EntityArray[idx - 1] !== undefined
                const shouldMakeNewHeader = previousBulletinDate === null || previousBulletinDate.getMonth() !== currentBulletinDate.getMonth()


                return (
                    <div key={bulletin.LightBulletinId}>
                        {shouldMakeNewHeader && hasNextBulletin && (
                            <div className={"flex items-center justify-center pb-6"}>
                                <div className={"h-[1px] w-full bg-foreground/20 rounded-full"} />                                <div className={"bg-foreground/5 rounded-md px-4 py-1 mx-4"}>
                                    <div className={"text-xs font-medium text-foreground/50"}>{currentBulletinDate.toLocaleString('default', { month: 'long' })}</div>
                                </div>
                                <div className={"h-[1px] w-full bg-foreground/20 rounded-full"} />
                            </div>
                        )}
                        <LightbulletinCard links={linkify.find(bulletin.Text)} bulletin={bulletin} />
                    </div>
                )
            })}
        </div>
    )
}