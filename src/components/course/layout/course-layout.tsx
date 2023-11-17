import {Helmet} from "react-helmet-async";
import {Outlet, useParams} from "react-router-dom";
import useGETcourseBasic from "@/queries/courses/useGETcourseBasic.ts";
import CourseHeader from "@/components/course/layout/course-header.tsx";
import {useCourse} from "@/hooks/atoms/useCourse";

export default function CourseLayout() {
    const {id} = useParams();
    const courseId = Number(id)

    const {data: course} = useGETcourseBasic({
        courseId: courseId
    }, {
        suspense: true,
    })

    const {setCourseId} = useCourse()

    setCourseId(courseId)

    return (
        <div
            className="flex-1 w-full overflow-hidden flex">
            <Helmet>
                <title>{course!.Title}</title>
            </Helmet>
            <div className="flex flex-col overflow-auto w-full">
                <CourseHeader courseId={courseId} courseCode={course!.Code} courseTitle={course!.Title}/>
                <div className="flex-1 overflow-auto flex flex-col">
                    <Outlet/>
                </div>
            </div>
        </div>
    )
}

