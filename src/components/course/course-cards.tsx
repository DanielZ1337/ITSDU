import {GETstarredCoursesParams} from "@/types/api-types/course-cards/GETstarredCourses.ts";
import {GETunstarredCoursesParams} from "@/types/api-types/course-cards/GETunstarredCourses.ts";
import useGETcourses from "@/queries/course-cards/useGETcourses.ts";
import {ClipboardList} from "lucide-react";
import CourseCard from "@/components/course/course-card.tsx";

export default function CourseCards({config, courseCardTypes}: {
    courseCardTypes: "Starred" | "Unstarred" | "All"
    config: GETstarredCoursesParams | GETunstarredCoursesParams
}) {
    const {data} = useGETcourses(courseCardTypes, {
        ...config,
    }, {
        suspense: true,
    })

    if (data!.EntityArray.length === 0) {
        return (
            <div className={"flex flex-col w-5/6 sm:w-72 h-36 m-40"}>
                <div className={"flex flex-col w-full h-full p-4 justify-center items-center"}>
                    <span
                        className={"text-gray-500 flex gap-2 items-center justify-center text-sm sm:text-base md:text-lg font-semibold tracking-tighter"}>
                        <ClipboardList/> No courses
                    </span>
                </div>
            </div>
        )
    }

    return (
        data!.EntityArray.map((card) => (
                <CourseCard card={card} key={card.CourseId}/>
            )
        )
    )
}