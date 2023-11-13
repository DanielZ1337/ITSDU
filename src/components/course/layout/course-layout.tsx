import {Helmet} from "react-helmet-async";
import {Outlet, useParams} from "react-router-dom";
// eslint-disable-next-line no-redeclare
import useGETcourseBasic from "@/queries/courses/useGETcourseBasic.ts";
import CourseHeader from "@/components/course/layout/course-header.tsx";
import {courseAtom} from "@/atoms/course";
import {useAtom} from "jotai";

export default function CourseLayout() {
    const params = useParams();
    const courseId = Number(params.id)

    const {data: course} = useGETcourseBasic({
        courseId: courseId
    }, {
        suspense: true,
    })

    const [, setCourse] = useAtom(courseAtom)

    setCourse(courseId)

    return (
        <div
            className="flex-1 w-full overflow-hidden flex">
            <Helmet>
                <title>{course!.Title}</title>
            </Helmet>
            {/* <div className="bg-zinc-100/40 lg:block dark:bg-zinc-800/40">
                <div className="flex h-full max-h-screen flex-col gap-2 overflow-hidden border-r">
                    <div className="flex-1 overflow-auto py-2">
                        <CourseLayoutSidebar />
                    </div>
                </div>
            </div> */}
            <div className="flex flex-col overflow-auto w-full">
                <CourseHeader courseId={courseId} courseCode={course!.Code} courseTitle={course!.Title}/>
                <div className="flex-1 overflow-auto flex flex-col">
                    <Outlet/>
                </div>
            </div>
        </div>
    )
}

