import axios from "axios";
import {baseUrl, cn} from "@/lib/utils";
import {useQuery} from "@tanstack/react-query";
import {ClipboardList, ListTodo, Megaphone, StarIcon, UserSquare2} from "lucide-react";
import {Link} from "react-router-dom";

export default function Index() {

    const {data, isLoading} = useQuery(['starredcards'], async () => {
        const res = await axios.get(`${baseUrl}restapi/personal/courses/cards/starred/v1?SortBy=rank&isShowMore=false&PageIndex=0&PageSize=24`, {
            params: {
                'access_token': window.localStorage.getItem('access_token')
            }
        })

        if (res.status !== 200) {
            throw new Error(res.statusText)
        }

        console.log(res.data)
        return res.data
    })

    if (isLoading) {
        return (
            <div className={"flex flex-col"}>
                <div className={"flex flex-row flex-wrap gap-4 items-center justify-center"}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((card: any) => {
                        return (
                            <div className={"flex flex-col w-72 h-36 bg-white rounded-md shadow-md"}>
                                <div className={"flex flex-col w-full h-1/2 p-4"}>
                                    <div className={"flex flex-row justify-between items-center"}>
                                        <div className={"w-4/5 h-4 bg-gray-200 rounded-md animate-pulse"}/>
                                        <StarIcon
                                            className={cn("stroke-yellow-500 shrink-0 m-1", card.IsFavouriteCourse && 'fill-yellow-500')}/>
                                    </div>
                                    <div className={"flex flex-col"}>
                                        <span className={"text-gray-500 text-sm"}>{card.courseDescription}</span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }

    return (
        <div className={"flex flex-col"}>
            <div className={"flex flex-row flex-wrap gap-4 items-center justify-center"}>
                {data?.EntityArray.map((card: any) => {
                    return (
                        <Link to={`/course?id=${card.CourseId}`} key={card.CourseId} className={"flex flex-col w-5/6 sm:w-72 h-36 bg-white rounded-md shadow-md"}>
                            <div className={"flex flex-col w-full p-4 justify-between h-full hover:outline outline-offset-4 rounded-md outline-foreground/50 hover:cursor-pointer"}>
                                <div className={"flex flex-row justify-between"}>
                                    <span className={"text-gray-500 text-sm"}>{card.Title}</span>
                                    <div className={"hover:cursor-pointer hover:bg-black/10 w-fit h-fit rounded-full p-1"}>
                                        <StarIcon
                                            className={cn("stroke-yellow-500 shrink-0 m-1 h-5 w-5", card.IsFavouriteCourse && 'fill-yellow-500')}/>
                                    </div>
                                </div>
                                <div className={"flex gap-2"}>
                                    {card.NumberOfAnnouncements > 0 && (
                                        <span className={"text-gray-500 text-sm flex gap-2 items-center justify-center"}><Megaphone /> {card.NumberOfAnnouncements}</span>
                                    )}
                                    {card.NumberOfFollowUpTasks > 0 && (
                                        <span className={"text-gray-500 text-sm flex gap-2 items-center justify-center"}><ListTodo />{card.NumberOfFollowUpTasks}</span>
                                    )}
                                    {card.NumberOfTasks > 0 && (
                                        <span className={"text-gray-500 text-sm flex gap-2 items-center justify-center"}><ClipboardList />{card.NumberOfTasks}</span>
                                    )}
                                    {card.NumberOfTeachers > 0 && (
                                        <span className={"text-gray-500 text-sm flex gap-2 items-center justify-center"}><UserSquare2 />{card.NumberOfTeachers}</span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}