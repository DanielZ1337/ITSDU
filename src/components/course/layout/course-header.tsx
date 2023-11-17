import {Button} from "@/components/ui/button.tsx";
import {cn} from "@/lib/utils.ts";
import {Loader2, Star} from "lucide-react";
import {Link} from "react-router-dom";
import useGETunstarredCourses from "@/queries/course-cards/useGETunstarredCourses.ts";
import useGETstarredCourses from "@/queries/course-cards/useGETstarredCourses.ts";
import {useQueryClient} from "@tanstack/react-query";
import usePUTcourseFavorite from "@/queries/courses/usePUTcourseFavorite.ts";
import {CourseNavigationMenu} from "@/components/course-navigation-menu";

export default function CourseHeader({courseTitle, courseCode, courseId}: {
    courseTitle: string
    courseCode: string
    courseId: number
}) {

    const {data: unstarredCourses} = useGETunstarredCourses({
        PageIndex: 0,
        PageSize: 1,
        searchText: courseTitle
    }, {
        suspense: true,
    })

    const {data: starredCourses} = useGETstarredCourses({
        PageIndex: 0,
        PageSize: 1,
        searchText: courseTitle
    }, {
        suspense: true,
    })

    const queryClient = useQueryClient()

    const unstarredCourse = unstarredCourses!.EntityArray[0]
    const starredCourse = starredCourses!.EntityArray[0]

    const {mutate: toggleStarred, isLoading: isTogglingStarred} = usePUTcourseFavorite({
        courseId,
    }, {
        onSuccess: () => {
            unstarredCourses!.EntityArray.splice(0, 1)
            starredCourses!.EntityArray.splice(0, 1)
            if (unstarredCourse) {
                starredCourses!.EntityArray.push(unstarredCourse)
            }
            if (starredCourse) {
                unstarredCourses!.EntityArray.push(starredCourse)
            }
        }
    })

    return (
        <header
            className="w-full sticky top-0 flex h-[60px] items-center gap-4 border-b bg-zinc-100/40 px-6 dark:bg-zinc-800/40 shadow z-10">
            <div className="w-full flex-1 flex justify-between">
                {/*<form className="relative">
                            <Input
                                placeholder="Search resources..."
                                className="pl-10 w-full appearance-none md:w-2/3 lg:w-1/3"
                            />
                            <div className="absolute top-1/2 transform -translate-y-1/2 left-3">
                                <AiOutlineSearch className="w-5 h-5 text-gray-500"/>
                            </div>
                        </form>*/}
                <div className={"flex flex-row items-center gap-2"}>
                    <Button variant={"ghost"} size={"icon"}
                            className={cn("shrink-0", !isTogglingStarred && 'hover:bg-yellow-400/10')}
                            onClick={() => toggleStarred({
                                courseId,
                            }, {
                                onSuccess: () => {
                                    queryClient.invalidateQueries(['courses', courseId])
                                    queryClient.invalidateQueries(['starredCourses', 'unstarredCourses'])
                                }
                            })}>
                        {isTogglingStarred ? (
                            <Loader2 className={"stroke-foreground shrink-0 m-1 h-6 w-6 animate-spin"}/>
                        ) : (
                            <Star
                                className={cn("w-6 h-6 dark:text-yellow-400 text-yellow-600 shrink-0", starredCourse && 'fill-yellow-600 dark:fill-yellow-400')}/>
                        )}
                    </Button>
                    <Link className="flex items-center font-semibold my-auto text-balance w-fit text-lg"
                          to=".">
                        <CourseNavigationMenu title={courseTitle}/>
                    </Link>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-nowrap my-auto ml-6">
                    {courseCode}
                </p>
            </div>
        </header>
    )
}