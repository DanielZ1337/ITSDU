import {Helmet} from "react-helmet-async";
import {Outlet, useParams} from "react-router-dom";
import useGETcourseBasic from "@/queries/courses/useGETcourseBasic.ts";
import CourseHeader from "@/components/course/layout/course-header.tsx";
import {useCourse} from "@/hooks/atoms/useCourse";
import {useEffect} from "react";

export default function CourseLayout() {
    const {id} = useParams();
    const courseId = Number(id)
    const {setCourseId} = useCourse()

    const {data: course} = useGETcourseBasic({
        courseId: courseId
    }, {
        suspense: true,
    })

    useEffect(() => {
        setCourseId(courseId)
    }, [courseId, setCourseId])

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