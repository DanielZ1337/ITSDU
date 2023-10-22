import { Link, useNavigate, useParams } from "react-router-dom";
import { Loader2, Star } from "lucide-react";
import SearchResourcesDialog from "@/components/resources/resources-search-dialog";
import useGETcourseBasic from "@/queries/courses/useGETcourseBasic.ts";
import { Button } from "@/components/ui/button.tsx";
import { Helmet } from "react-helmet-async";
import Splitter, { SplitDirection } from "@devbookhq/splitter";
import { Suspense } from "react";
import LightbulletinsForCourseLoader from "@/components/lightbulletin/lightbulletins-for-course-loader.tsx";
import LightbulletinsForCourse from "@/components/lightbulletin/lightbulletins-for-course.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import Resources from "@/components/resources/resources.tsx";
import '../styles/splitter-custom.css'
import useGETunstarredCourses from "@/queries/course-cards/useGETunstarredCourses.ts";
import useGETstarredCourses from "@/queries/course-cards/useGETstarredCourses.ts";
import { cn } from "@/lib/utils.ts";
import usePUTcourseFavorite from "@/queries/courses/usePUTcourseFavorite.ts";

export default function Sidebar() {
    const params = useParams();
    const courseId = Number(params.id)
    // const courseId = 29219
    // const courseTitle = 'Semester project: Distributed software systems with industrial cyber-physical elements, (E23)'
    // const courseIdentifier = 'T500019101-1-E23'
    const { data: course } = useGETcourseBasic({
        courseId: courseId
    }, {
        suspense: true,
    })

    const { data: unstarredCourses } = useGETunstarredCourses({
        PageIndex: 0,
        PageSize: 1,
        searchText: course!.Title
    }, {
        suspense: true,
    })

    const { data: starredCourses } = useGETstarredCourses({
        PageIndex: 0,
        PageSize: 1,
        searchText: course!.Title
    }, {
        suspense: true,
    })

    const unstarredCourse = unstarredCourses!.EntityArray[0]
    const starredCourse = starredCourses!.EntityArray[0]

    const { mutate: toggleStarred, isPending: isTogglingStarred } = usePUTcourseFavorite({
        courseId: courseId,
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
            <div className="order-r bg-zinc-100/40 lg:block dark:bg-zinc-800/40">
                <div className="flex h-full max-h-screen flex-col gap-2 overflow-hidden border-r">
                    <div className="flex-1 overflow-auto py-2">
                        <nav className="grid items-start gap-6 px-4 text-sm font-medium">
                            <div>
                                <div className={"py-1"}>
                                    <SearchResourcesDialog courseId={courseId} />
                                </div>
                                <h1 className="hidden lg:block px-3 py-2 text-zinc-500 dark:text-zinc-400">
                                    Overview
                                </h1>
                                <Link
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-500 transition-all hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                                    to="#"
                                >
                                    <svg
                                        className=" h-4 w-4"
                                        fill="none"
                                        height="24"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                        width="24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <rect height="18" rx="2" ry="2" width="18" x="3" y="4" />
                                        <line x1="16" x2="16" y1="2" y2="6" />
                                        <line x1="8" x2="8" y1="2" y2="6" />
                                        <line x1="3" x2="21" y1="10" y2="10" />
                                    </svg>
                                    <p className={"hidden lg:block"}>
                                        Schedule
                                    </p>
                                </Link>
                                <Link
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-500 transition-all hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                                    to="#"
                                >
                                    <svg
                                        className=" h-4 w-4"
                                        fill="none"
                                        height="24"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                        width="24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M17 6.1H3" />
                                        <path d="M21 12.1H3" />
                                        <path d="M15.1 18H3" />
                                    </svg>
                                    <p className={"hidden lg:block"}>
                                        Announcements (5)
                                    </p>
                                </Link>
                                <Link
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-500 transition-all hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                                    to="#"
                                >
                                    <svg
                                        className=" h-4 w-4"
                                        fill="none"
                                        height="24"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                        width="24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                                        <polyline points="14 2 14 8 20 8" />
                                    </svg>
                                    <p className={"hidden lg:block"}>
                                        Resources (2)
                                    </p>
                                </Link>
                                <Link
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-500 transition-all hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                                    to="#"
                                >
                                    <svg
                                        className=" h-4 w-4"
                                        fill="none"
                                        height="24"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                        width="24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M21 12.79V21H3v-8.21M21 12.79l-9-7-9 7M21 12.79l-9-7-9 7" />
                                        <path d="M3 21h18" />
                                        <path d="M6 12h12" />
                                        <path d="M9 9l3 3 3-3" />
                                    </svg>
                                    <p className={"hidden lg:block"}>
                                        Tasks (2)
                                    </p>
                                </Link>
                                <Link
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-500 transition-all hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                                    to="#"
                                >
                                    <svg
                                        className=" h-4 w-4"
                                        fill="none"
                                        height="24"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                        width="24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M21 12.79V21H3v-8.21M21 12.79l-9-7-9 7M21 12.79l-9-7-9 7" />
                                        <path d="M3 21h18" />
                                        <path d="M6 12h12" />
                                        <path d="M9 9l3 3 3-3" />
                                    </svg>
                                    <p className={"hidden lg:block"}>
                                        Grades (2)
                                    </p>
                                </Link>
                                <Link to={"#"}
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-500 transition-all hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
                                    <svg
                                        className=" h-4 w-4"
                                        fill="none"
                                        height="24"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                        width="24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M21 12.79V21H3v-8.21M21 12.79l-9-7-9 7M21 12.79l-9-7-9 7" />
                                        <path d="M3 21h18" />
                                        <path d="M6 12h12" />
                                        <path d="M9 9l3 3 3-3" />
                                    </svg>
                                    <p className={"hidden lg:block"}>
                                        People (2)
                                    </p>
                                </Link>
                                <Link to={"#"}
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-500 transition-all hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
                                    <svg
                                        className=" h-4 w-4"
                                        fill="none"
                                        height="24"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                        width="24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M21 12.79V21H3v-8.21M21 12.79l-9-7-9 7M21 12.79l-9-7-9 7" />
                                        <path d="M3 21h18" />
                                        <path d="M6 12h12" />
                                        <path d="M9 9l3 3 3-3" />
                                    </svg>
                                    <p className={"hidden lg:block"}>
                                        Course Information
                                    </p>
                                </Link>
                            </div>
                        </nav>
                    </div>
                </div>
            </div>
            <div className="flex flex-col overflow-auto w-full">
                <header
                    className="w-full sticky top-0 flex h-[60px] items-center gap-4 border-b bg-zinc-100/40 px-6 dark:bg-zinc-800/40">
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
                        <div className={"flex flex-row items-center gap-4"}>
                            <Button variant={"ghost"} size={"icon"}
                                className={cn("shrink-0", !isTogglingStarred && 'hover:bg-yellow-400/10')}
                                onClick={() => toggleStarred({
                                    courseId: courseId,
                                })}>
                                {isTogglingStarred ? (
                                    <Loader2 className={"stroke-foreground shrink-0 m-1 h-6 w-6 animate-spin"} />
                                ) : (
                                    <Star
                                        className={cn("w-6 h-6 dark:text-yellow-400 text-yellow-600 shrink-0", starredCourse && 'fill-yellow-600 dark:fill-yellow-400')} />
                                )}
                            </Button>
                            <Link className="flex items-center gap-4 font-semibold my-auto text-balance w-fit text-lg"
                                to="#">
                                {course!.Title}
                            </Link>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-nowrap my-auto ml-6">
                            {course!.Code}
                        </p>
                    </div>
                </header>
                <div className="flex-1 overflow-auto">
                    <div className="grid items-start gap-6 px-4 text-sm font-medium h-full">
                        <div className={"flex gap-4 flex-1 h-full"}>
                            <Splitter direction={SplitDirection.Horizontal} minWidths={[300, 300]}
                                initialSizes={[200, 100]}>
                                <div className={"flex flex-col flex-1 py-2 pr-2"}>
                                    <div className={"flex flex-col flex-1 gap-4"}>
                                        <h2 className={"text-xl font-bold"}>Lightbulletins</h2>
                                        <Suspense
                                            fallback={<LightbulletinsForCourseLoader />}
                                        >
                                            <LightbulletinsForCourse courseId={courseId} />
                                        </Suspense>

                                    </div>
                                </div>
                                <div
                                    className={"flex flex-col gap-4 overflow pr-4 fixed"}>
                                    <h2 className={"text-xl font-bold"}>Resources</h2>

                                    <Suspense
                                        fallback={<div className={"flex flex-col gap-2 w-full"}>
                                            <Skeleton className="h-4 bg-gray-400 rounded" />
                                            <Skeleton className="h-4 bg-gray-400 rounded" />
                                            <Skeleton className="h-4 bg-gray-400 rounded" />
                                            <Skeleton className="h-4 bg-gray-400 rounded" />
                                        </div>}>
                                        <Resources courseId={courseId} />
                                    </Suspense>
                                </div>
                            </Splitter>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}