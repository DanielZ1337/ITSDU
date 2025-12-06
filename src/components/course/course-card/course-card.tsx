import { isCoursesBulkStarEditingAtom } from "@/atoms/courses-bulk-star-edit.ts";
import { Button } from "@/components/ui/button.tsx";
import { Loader } from "@/components/ui/loader.tsx";
import { cn } from "@/lib/utils.ts";
import usePUTcourseFavorite from "@/queries/courses/usePUTcourseFavorite.ts";
import { ItslearningRestApiEntitiesCourseCard } from "@/types/api-types/utils/Itslearning.RestApi.Entities.CourseCard.ts";
import { Checkbox } from "@nextui-org/react";
import { useAtom } from "jotai";
import {
	ArrowRight,
	ClipboardList,
	ListTodo,
	Megaphone,
	StarIcon,
	UserSquare2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CourseCardContextMenu from "./course-card-context-menu.tsx";
import CourseCardInfo from "./course-card-info.tsx";

// Color palette for course cards - creates visual variety
const courseColors = [
	{ bg: "from-orange-500/10 to-amber-500/5", accent: "bg-orange-500", text: "text-orange-600 dark:text-orange-400" },
	{ bg: "from-blue-500/10 to-cyan-500/5", accent: "bg-blue-500", text: "text-blue-600 dark:text-blue-400" },
	{ bg: "from-emerald-500/10 to-teal-500/5", accent: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400" },
	{ bg: "from-purple-500/10 to-violet-500/5", accent: "bg-purple-500", text: "text-purple-600 dark:text-purple-400" },
	{ bg: "from-rose-500/10 to-pink-500/5", accent: "bg-rose-500", text: "text-rose-600 dark:text-rose-400" },
	{ bg: "from-indigo-500/10 to-blue-500/5", accent: "bg-indigo-500", text: "text-indigo-600 dark:text-indigo-400" },
	{ bg: "from-teal-500/10 to-emerald-500/5", accent: "bg-teal-500", text: "text-teal-600 dark:text-teal-400" },
	{ bg: "from-amber-500/10 to-yellow-500/5", accent: "bg-amber-500", text: "text-amber-600 dark:text-amber-400" },
];

function getColorForCourse(courseId: number) {
	return courseColors[courseId % courseColors.length];
}

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
	const [isCoursesBulkEditing] = useAtom(isCoursesBulkStarEditingAtom);
	const color = getColorForCourse(card.CourseId);

	const totalNotifications = card.NumberOfAnnouncements + card.NumberOfFollowUpTasks + card.NumberOfTasks;
	const hasNotifications = totalNotifications > 0;

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
				tabIndex={0}
				onClick={navigateToCourse}
				className={cn(
					"group relative flex flex-col w-full cursor-pointer",
					"bg-card dark:bg-card/80 rounded-xl overflow-hidden",
					"border border-border/50 hover:border-border",
					"shadow-sm hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20",
					"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
					"transition-all duration-300",
				)}
			>
				{/* Top accent gradient bar */}
				<div className={cn(
					"absolute inset-x-0 top-0 h-1 rounded-t-xl",
					color.accent,
				)} />

				{/* Subtle gradient background on hover */}
				<div className={cn(
					"absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300",
					color.bg,
				)} />

				{/* Card content */}
				<div className="relative flex flex-col p-4 gap-3 flex-1">
					{/* Header with title and star */}
					<div className="flex items-start justify-between gap-3">
						<div className="flex-1 min-w-0">
							<h3 className={cn(
								"font-semibold text-foreground leading-tight tracking-tight",
								"line-clamp-2 text-sm sm:text-base",
								"group-hover:text-primary transition-colors duration-200",
							)}>
								{card.Title}
							</h3>
							{card.LastUpdatedDisplayTime && (
								<p className="mt-1 text-xs text-muted-foreground truncate">
									Updated {card.LastUpdatedDisplayTime}
								</p>
							)}
						</div>

						{/* Star button */}
						<Button
							variant="ghost"
							size="icon"
							disabled={isLoading}
							onClick={(e) => {
								e.stopPropagation();
								mutate({ courseId: card.CourseId });
							}}
							className={cn(
								"shrink-0 w-8 h-8 rounded-full",
								"hover:bg-yellow-500/10 dark:hover:bg-yellow-500/20",
								"transition-all duration-200",
								card.IsFavouriteCourse && "hover:scale-110",
							)}
						>
							{!isCoursesBulkEditing ? (
								isLoading ? (
									<Loader className="w-4 h-4 text-muted-foreground" />
								) : (
									<StarIcon
										className={cn(
											"w-5 h-5 transition-all duration-200",
											card.IsFavouriteCourse
												? "fill-yellow-500 stroke-yellow-500 drop-shadow-[0_0_6px_rgb(234,179,8)]"
												: "stroke-muted-foreground group-hover:stroke-yellow-500/70",
										)}
									/>
								)
							) : (
								<Checkbox
									className="m-0 p-0 w-fit"
									defaultChecked={card.IsFavouriteCourse}
									checked={card.IsFavouriteCourse}
									defaultSelected={card.IsFavouriteCourse}
								/>
							)}
						</Button>
					</div>

					{/* Notification badge */}
					{hasNotifications && (
						<div className="flex items-center gap-1">
							<span className={cn(
								"inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
								"bg-primary/10 text-primary",
							)}>
								<span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
								{totalNotifications} new
							</span>
						</div>
					)}

					{/* Spacer */}
					<div className="flex-1" />

					{/* Footer with info badges */}
					<div className="flex items-center justify-between gap-2 pt-2 border-t border-border/50">
						<div className="flex items-center gap-1.5 flex-wrap">
							{card.NumberOfAnnouncements > 0 && (
								<CourseCardInfo
									icon={<Megaphone />}
									count={card.NumberOfAnnouncements}
									href={`/courses/${card.CourseId}/updates`}
									label="Announcements"
								/>
							)}
							{card.NumberOfFollowUpTasks > 0 && (
								<CourseCardInfo
									icon={<ListTodo />}
									count={card.NumberOfFollowUpTasks}
									href={`/courses/${card.CourseId}/tasks`}
									label="Follow-up tasks"
								/>
							)}
							{card.NumberOfTasks > 0 && (
								<CourseCardInfo
									icon={<ClipboardList />}
									count={card.NumberOfTasks}
									href={`/courses/${card.CourseId}/tasks`}
									label="Tasks"
								/>
							)}
							{card.NumberOfTeachers > 0 && (
								<CourseCardInfo
									icon={<UserSquare2 />}
									count={card.NumberOfTeachers}
									href={`/courses/${card.CourseId}/participants`}
									label="Teachers"
								/>
							)}
						</div>

						{/* Arrow indicator */}
						<ArrowRight className={cn(
							"w-4 h-4 text-muted-foreground shrink-0",
							"opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0",
							"transition-all duration-200",
						)} />
					</div>
				</div>
			</div>
		</CourseCardContextMenu>
	);
}
