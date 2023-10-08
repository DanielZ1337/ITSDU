import { ClipboardList, ListTodo, Megaphone, StarIcon, UserSquare2 } from "lucide-react";
import { cn } from "@/lib/utils.ts";
import { useNavigate } from "react-router-dom";
import { ItslearningRestApiEntitiesCourseCard } from "@/api-types/utils/Itslearning.RestApi.Entities.CourseCard.ts";
import usePUTcourseFavorite from "@/queries/courses/usePUTcourseFavorite.ts";
import { Button } from "@/components/ui/button.tsx";
import { useToast } from "@/components/ui/use-toast";

export default function CourseCard({ card }: {
    card: ItslearningRestApiEntitiesCourseCard
}) {
    const navigate = useNavigate()
    const { toast } = useToast()
    const { mutate, isLoading } = usePUTcourseFavorite({
        courseId: card.CourseId,
    })

    return (
        <div key={card.CourseId}
            onClick={(e) => {
                e.stopPropagation()
                navigate(`/course/${card.CourseId}`)
            }}
            className={"flex flex-col w-5/6 sm:w-72 h-36 bg-white rounded-md shadow-md focus-visible:outline-0 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-secondary-300"}>
            <div
                className={"flex flex-col w-full p-4 justify-between h-full hover:outline outline-offset-4 rounded-md outline-foreground/50 hover:cursor-pointer"}>
                <div className={"flex flex-row justify-between"}>
                    <span
                        className={"leading-snug tracking-tighter text-black font-semibold"}>{card.Title}</span>
                    <Button
                        variant={"ghost"}
                        size={"icon"}
                        disabled={isLoading}
                        onClick={(e) => {
                            e.stopPropagation()
                            mutate({
                                courseId: card.CourseId,
                            }, {
                                onSuccess: () => {
                                    card.IsFavouriteCourse = !card.IsFavouriteCourse
                                    toast({
                                        title: "Success",
                                        description: `Course ${card.Title} is now ${card.IsFavouriteCourse ? "starred" : "unstarred"}.`,
                                        duration: 5000,
                                        variant: "success",
                                    })
                                },
                                onError: (e) => {
                                    toast({
                                        title: "Error",
                                        description: e.message || "An error occurred while trying to update the course's favorite status.",
                                        duration: 5000,
                                        variant: "destructive",
                                    })
                                }
                            })
                        }}
                        className={"hover:cursor-pointer hover:bg-black/10 w-fit h-fit rounded-full p-1"}>
                        <StarIcon
                            className={cn("stroke-yellow-500 shrink-0 m-1 h-6 w-6", card.IsFavouriteCourse && 'fill-yellow-500')} />
                    </Button>
                </div>
                <div className={"flex gap-2"}>
                    {card.NumberOfAnnouncements > 0 && (
                        <span
                            className={"text-gray-500 text-sm flex gap-2 items-center justify-center"}>
                            <Megaphone /> {card.NumberOfAnnouncements}
                        </span>
                    )}
                    {card.NumberOfFollowUpTasks > 0 && (
                        <span
                            className={"text-gray-500 text-sm flex gap-2 items-center justify-center"}>
                            <ListTodo />{card.NumberOfFollowUpTasks}
                        </span>
                    )}
                    {card.NumberOfTasks > 0 && (
                        <span
                            className={"text-gray-500 text-sm flex gap-2 items-center justify-center"}>
                            <ClipboardList />{card.NumberOfTasks}
                        </span>
                    )}
                    {card.NumberOfTeachers > 0 && (
                        <span
                            className={"text-gray-500 text-sm flex gap-2 items-center justify-center"}>
                            <UserSquare2 />{card.NumberOfTeachers}
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}