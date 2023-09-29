import {cn} from "@/lib/utils";
import {ClipboardList, ListTodo, Megaphone, StarIcon, UserSquare2} from "lucide-react";
import {Link} from "react-router-dom";
import {Suspense} from "react";
import useGETstarredCourses from "@/queries/course-cards/useGETstarredCourses.ts";

function Cards() {
    const {data} = useGETstarredCourses({
        PageSize: 24,
        isShowMore: false,
        PageIndex: 0,
        sortBy: "rank",
    }, {
        suspense: true,
    })

    if (data!.EntityArray.length === 0) {
        return (
            <div className={"m-auto"}>
                <span className={"text-gray-500 text-sm"}>No starred cards</span>
            </div>
        )
    }

    return (
        data!.EntityArray.map((card) => {
            return (
                <Link to={`/course?id=${card.CourseId}`} key={card.CourseId}
                      className={"flex flex-col w-5/6 sm:w-72 h-36 bg-white rounded-md shadow-md"}>
                    <div
                        className={"flex flex-col w-full p-4 justify-between h-full hover:outline outline-offset-4 rounded-md outline-foreground/50 hover:cursor-pointer"}>
                        <div className={"flex flex-row justify-between"}>
                            <span className={"leading-none tracking-tight text-black font-semibold"}>{card.Title}</span>
                            <div
                                className={"hover:cursor-pointer hover:bg-black/10 w-fit h-fit rounded-full p-1"}>
                                <StarIcon
                                    className={cn("stroke-yellow-500 shrink-0 m-1 h-5 w-5", card.IsFavouriteCourse && 'fill-yellow-500')}/>
                            </div>
                        </div>
                        <div className={"flex gap-2"}>
                            {card.NumberOfAnnouncements > 0 && (
                                <span
                                    className={"text-gray-500 text-sm flex gap-2 items-center justify-center"}>
                                    <Megaphone/> {card.NumberOfAnnouncements}
                                </span>
                            )}
                            {card.NumberOfFollowUpTasks > 0 && (
                                <span
                                    className={"text-gray-500 text-sm flex gap-2 items-center justify-center"}>
                                    <ListTodo/>{card.NumberOfFollowUpTasks}
                                </span>
                            )}
                            {card.NumberOfTasks > 0 && (
                                <span
                                    className={"text-gray-500 text-sm flex gap-2 items-center justify-center"}>
                                    <ClipboardList/>{card.NumberOfTasks}
                                </span>
                            )}
                            {card.NumberOfTeachers > 0 && (
                                <span
                                    className={"text-gray-500 text-sm flex gap-2 items-center justify-center"}>
                                    <UserSquare2/>{card.NumberOfTeachers}
                                </span>
                            )}
                        </div>
                    </div>
                </Link>
            )
        })
    )
}


export default function Index() {

    return (
        <div className={"flex flex-col flex-1 h-full w-full py-4"}>
            <div className={"flex flex-row flex-1 gap-4 flex-wrap justify-center"}>
                <Suspense fallback={
                    [...Array(4).keys()].map(i => i + 1).map((card: any) => (
                            <div key={card} className={"flex flex-col w-72 h-36 bg-white rounded-md shadow-md"}>
                                <div className={"flex flex-col w-full h-1/2 p-4"}>
                                    <div className={"flex flex-row justify-between items-center"}>
                                        <div className={"w-4/5 h-4 bg-gray-200 rounded-md animate-pulse"}/>
                                        <StarIcon
                                            className={cn("stroke-yellow-500 shrink-0 m-1", card.IsFavouriteCourse && 'fill-yellow-500')}/>
                                    </div>
                                </div>
                            </div>
                        )
                    )
                }>
                    <div className={"items-center w-full h-full flex-wrap flex gap-4 justify-center flex-1 my-auto"}>
                        <Cards/>
                    </div>
                </Suspense>
            </div>
        </div>
    )
}