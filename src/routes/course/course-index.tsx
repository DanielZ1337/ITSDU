import Splitter, { SplitDirection } from "@devbookhq/splitter";
import { Suspense } from "react";
import LightbulletinsForCourseLoader from "@/components/lightbulletin/lightbulletins-for-course-loader.tsx";
import LightbulletinsForCourse from "@/components/lightbulletin/lightbulletins-for-course.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import Resources from "@/components/resources/resources.tsx";
import { useParams } from "react-router-dom";
import { Bell, Files } from "lucide-react";
import '@/styles/splitter-custom.css'

export default function CourseIndex() {
    const { id } = useParams();
    const courseId = Number(id)

    return (
        <div className="grid h-full items-start gap-6 px-4 text-sm font-medium">
            <div className={"flex gap-4 flex-1 h-full"}>
                <Splitter direction={SplitDirection.Horizontal} minWidths={[300, 300]}
                    initialSizes={[200, 100]}>
                    <div className={"flex flex-col flex-1 py-2 pr-2"}>
                        <div className={"flex flex-col flex-1 gap-4"}>
                            <h2 className={"text-xl font-bold items-center gap-4 inline-flex"}><Bell /> Announcements
                            </h2>
                            <Suspense fallback={<LightbulletinsForCourseLoader />}>
                                <LightbulletinsForCourse courseId={courseId} />
                            </Suspense>
                        </div>
                    </div>
                    <div
                        className={"flex flex-col gap-4 pr-4 py-2"}>
                        <h2 className={"text-xl font-bold inline-flex gap-4"}><Files /> Resources</h2>
                        <Suspense
                            fallback={<div className={"flex flex-col gap-2 w-full"}>
                                <Skeleton className="h-4 rounded bg-foreground/20" />
                                <Skeleton className="h-4 rounded bg-foreground/20" />
                                <Skeleton className="h-4 rounded bg-foreground/20" />
                                <Skeleton className="h-4 rounded bg-foreground/20" />
                            </div>}>
                            <Resources courseId={courseId} />
                        </Suspense>
                    </div>
                </Splitter>
            </div>
        </div>
    )
}