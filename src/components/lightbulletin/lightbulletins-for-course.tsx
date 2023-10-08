import useGETlightbulletinsForCourse from "@/queries/lightbulletin-course/useGETlightbulletinsForCourse.ts";
import LightbulletinCard from "@/components/lightbulletin/lightbulletin-card.tsx";
import React from "react";

export default function LightbulletinsForCourse({courseId}: {
    courseId: number
}) {

    const {data} = useGETlightbulletinsForCourse({
        courseId: courseId
    }, {
        suspense: true,
    })

    /*const ref = React.useRef<HTMLDivElement>(null)

    useEffect(() => {
        function setHeightOfScrollElement() {
            const height = window.innerHeight - ref.current!.getBoundingClientRect().top - 20
            ref.current!.style.height = `${height}px`
        }

        setHeightOfScrollElement()
        window.addEventListener('resize', setHeightOfScrollElement)
        ref.current?.addEventListener('mouseover', setHeightOfScrollElement)
        return () => {
            window.removeEventListener('resize', setHeightOfScrollElement)
            ref.current?.removeEventListener('mouseover', setHeightOfScrollElement)
        }
    }, []);*/

    return (
        /*<ScrollShadow
            ref={ref}
            style={{height: 'calc(100vh - 100px)'}}
            className={"w-full my-2 p-2 scrollbar hover:scrollbar-thumb-foreground/15 active:scrollbar-thumb-foreground/10 scrollbar-thumb-foreground/20 scrollbar-w-2 scrollbar-thumb-rounded-full"}>*/
        <div className={"grid grid-cols-1 gap-4"}>
            {data!.EntityArray.map((bulletin, idx) => {
                    return (
                        <LightbulletinCard key={idx} bulletin={bulletin}/>
                    )
                }
            )}
        </div>
        // </ScrollShadow>
    )
}