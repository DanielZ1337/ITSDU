import {Helmet} from "react-helmet";
import {Outlet, useNavigate, useParams} from "react-router-dom";
import {Button} from "@/components/ui/button.tsx";
// eslint-disable-next-line no-redeclare
import useGETcourseBasic from "@/queries/courses/useGETcourseBasic.ts";
import CourseHeader from "@/components/course/layout/course-header.tsx";
import CourseLayoutSidebar from "@/components/course/layout/course-layout-sidebar.tsx";

export default function CourseLayout() {
    const params = useParams();
    const courseId = Number(params.id)

    const {data: course} = useGETcourseBasic({
        courseId: courseId
    }, {
        suspense: true,
    })

    const navigate = useNavigate()

    if (!courseId) {
        return (
            <div className={"m-auto"}>
                <div className={"flex flex-col gap-4 w-full p-4 items-center"}>
                    <p className={"text-3xl font-bold text-balance"}>Course not found</p>
                    <Button variant={"secondary"} size={"lg"} onClick={() => navigate(-1)}>Go back</Button>
                </div>
            </div>
        )
    }

    return (
        <div
            className="lg:grid flex-1 w-full overflow-hidden flex lg:grid-cols-[200px_1fr] xl:grid-cols-[240px_1fr]">
            <Helmet>
                <title>{course!.Title}</title>
            </Helmet>
            <div className="bg-zinc-100/40 lg:block dark:bg-zinc-800/40">
                <div className="flex h-full max-h-screen flex-col gap-2 overflow-hidden border-r">
                    <div className="flex-1 overflow-auto py-2">
                        <CourseLayoutSidebar/>
                    </div>
                </div>
            </div>
            <div className="flex flex-col overflow-auto w-full">
                <CourseHeader courseId={courseId} courseCode={course!.Code} courseTitle={course!.Title}/>
                <div className="flex-1 overflow-auto flex flex-col">
                    <Outlet/>
                </div>
            </div>
        </div>
    )
}

