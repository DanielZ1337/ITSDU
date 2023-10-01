import useGETlightbulletinsForCourse from "@/queries/lightbulletin-course/useGETlightbulletinsForCourse.ts";
import LightbulletinCard from "@/components/lightbulletin/lightbulletin-card.tsx";

export default function LightbulletinsForCourse({courseId}: { courseId: number }) {

    const {data} = useGETlightbulletinsForCourse({
        courseId: courseId
    }, {
        suspense: true,
    })

    return (
        <div className={"grid grid-cols-1 gap-4"}>
            {data!.EntityArray.map((bulletin) => {
                    return (
                        <LightbulletinCard bulletin={bulletin}/>
                    )
                }
            )}
        </div>
    )
}