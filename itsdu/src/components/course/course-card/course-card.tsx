import {
	ClipboardList,
	ListTodo,
	Megaphone,
	StarIcon,
	UserSquare2,
} from "lucide-react";
import { cn } from "@/lib/utils.ts";
import { useNavigate } from "react-router-dom";
import { ItslearningRestApiEntitiesCourseCard } from "@/types/api-types/utils/Itslearning.RestApi.Entities.CourseCard.ts";
import usePUTcourseFavorite from "@/queries/courses/usePUTcourseFavorite.ts";
import { Button } from "@/components/ui/button.tsx";
import { useAtom } from "jotai";
import { isCoursesBulkStarEditingAtom } from "@/atoms/courses-bulk-star-edit.ts";
import { Checkbox } from "@nextui-org/react";
import CourseCardInfo from "./course-card-info.tsx";
import CourseCardContextMenu from "./course-card-context-menu.tsx";
import { Loader } from "@/components/ui/loader.tsx";
import { toast } from "sonner";

export default function CourseCard({
	card,
}: { card: ItslearningRestApiEntitiesCourseCard }) {
	const navigate = useNavigate();
	const { mutate, isLoading } = usePUTcourseFavorite(
		{
			courseId: card.CourseId,
		},
		{
			onError(error) {
				toast.error(
					`An error occurred while trying to update the course's favorite status.`,
					{
						description:
							error.message ||
							"An error occurred while trying to update the course's favorite status.",
					},
				);
			},
			onSuccess() {
				card.IsFavouriteCourse = !card.IsFavouriteCourse;
				toast.success(
					`Course ${card.Title} is now ${card.IsFavouriteCourse ? "starred" : "unstarred"}.`,
				);
			},
		},
	);
	const [isCoursesBulkEditing /*setIsCoursesBulkEditing*/] = useAtom(
		isCoursesBulkStarEditingAtom,
	);

	// const [coursesBulkEdit, setCoursesBulkEdit] = useAtom(CoursesBulkStarEditAtom)

	function navigateToCourse() {
		navigate(`/courses/${card.CourseId}`);
	}

	return (
		<CourseCardContextMenu courseId={card.CourseId}>
			<div
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						navigateToCourse();
					}
				}}
				key={card.CourseId}
				tabIndex={0}
				onClick={navigateToCourse}
				className={
					"flex flex-col w-5/6 sm:w-72 h-36 lg:w-80 lg:h-44 3xl:text-lg bg-white rounded-md shadow-md focus-visible:outline-0 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-secondary-300"
				}
			>
				<div
					className={
						"flex flex-col w-full p-4 justify-between h-full hover:outline outline-offset-4 rounded-md outline-foreground/50 hover:cursor-pointer"
					}
				>
					<div className={"flex flex-row justify-between"}>
						<span
							className={
								"leading-snug tracking-tighter text-black font-semibold text-balance"
							}
						>
							{card.Title}
						</span>
						<Button
							variant={"ghost"}
							size={"icon"}
							disabled={isLoading}
							onClick={(e) => {
								e.stopPropagation();
								mutate({
									courseId: card.CourseId,
								});
							}}
							className={
								"hover:cursor-pointer hover:bg-yellow-400/10 w-fit h-fit rounded-full p-1"
							}
						>
							{!isCoursesBulkEditing ? (
								isLoading ? (
									<Loader className={"m-1 text-black stroke-black/50"} />
								) : (
									<StarIcon
										className={cn(
											"stroke-yellow-500 shrink-0 m-1 h-6 w-6",
											card.IsFavouriteCourse && "fill-yellow-500",
										)}
									/>
								)
							) : (
								<Checkbox
									className={
										"m-0 p-0 w-fit max-h-[20px] max-w-[20px] flex-shrink-0 flex-grow-0"
									}
									defaultChecked={card.IsFavouriteCourse}
									checked={card.IsFavouriteCourse}
									defaultSelected={card.IsFavouriteCourse}
									/*onChange={() => {
                                        setCoursesBulkEdit({
                                            ...coursesBulkEdit,
                                            [card.CourseId]: !card.IsFavouriteCourse,
                                        })
                                    }}*/
								/>
							)}
						</Button>
					</div>
					<div className={"flex gap-2 w-full justify-evenly"}>
						{card.NumberOfAnnouncements > 0 && (
							<CourseCardInfo
								icon={<Megaphone />}
								count={card.NumberOfAnnouncements}
								href={`/courses/${card.CourseId}/updates`}
							/>
						)}
						{card.NumberOfFollowUpTasks > 0 && (
							<CourseCardInfo
								icon={<ListTodo />}
								count={card.NumberOfFollowUpTasks}
								href={`/courses/${card.CourseId}/tasks`}
							/>
						)}
						{card.NumberOfTasks > 0 && (
							<CourseCardInfo
								icon={<ClipboardList />}
								count={card.NumberOfTasks}
								href={`/courses/${card.CourseId}/tasks`}
							/>
						)}
						{card.NumberOfTeachers > 0 && (
							<CourseCardInfo
								icon={<UserSquare2 />}
								count={card.NumberOfTeachers}
								href={`/courses/${card.CourseId}/participants`}
							/>
						)}
					</div>
				</div>
			</div>
		</CourseCardContextMenu>
	);
}
