import { CourseNavigationMenu } from "@/components/course-navigation-menu";
import { Button } from "@/components/ui/button.tsx";
import { Loader } from "@/components/ui/loader";
import { cn } from "@/lib/utils.ts";
import useGETstarredCourses from "@/queries/course-cards/useGETstarredCourses.ts";
import useGETunstarredCourses from "@/queries/course-cards/useGETunstarredCourses.ts";
import useGETcourseBasic from "@/queries/courses/useGETcourseBasic";
import usePUTcourseFavorite from "@/queries/courses/usePUTcourseFavorite.ts";
import { TanstackKeys } from "@/types/tanstack-keys";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, m } from "framer-motion";
import { Star } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

export default function CourseHeader({
	courseId,
}: {
	courseId: number;
}) {
	const { data: course } = useGETcourseBasic(
		{
			courseId: courseId,
		},
		{
			suspense: true,
		},
	);

	const courseCode = course!.Code;
	const courseTitle = course!.Title;

	const { data: unstarredCourses } = useGETunstarredCourses(
		{
			PageIndex: 0,
			PageSize: 1,
			searchText: courseTitle,
		},
		{
			suspense: true,
		},
	);

	const { data: starredCourses } = useGETstarredCourses(
		{
			PageIndex: 0,
			PageSize: 1,
			searchText: courseTitle,
		},
		{
			suspense: true,
		},
	);

	const queryClient = useQueryClient();

	const unstarredCourse = unstarredCourses!.EntityArray[0];
	const starredCourse = starredCourses!.EntityArray[0];

	const { mutate: toggleStarred, isLoading: isTogglingStarred } =
		usePUTcourseFavorite(
			{
				courseId,
			},
			{
				onSuccess: () => {
					unstarredCourses!.EntityArray.splice(0, 1);
					starredCourses!.EntityArray.splice(0, 1);
					if (unstarredCourse) {
						starredCourses!.EntityArray.push(unstarredCourse);
					}
					if (starredCourse) {
						unstarredCourses!.EntityArray.push(starredCourse);
					}
				},
			},
		);

	return (
		<header className="sticky top-0 z-10 flex w-full items-center gap-4 border-b bg-zinc-100/40 px-6 shadow h-[60px] dark:bg-zinc-800/40">
			<Helmet>
				<title>{course!.Title}</title>
			</Helmet>
			<div className="flex w-full flex-1 justify-between">
				<div className={"flex flex-row items-center gap-2"}>
					<Button
						variant={"ghost"}
						size={"icon"}
						className={cn(
							"transition-all shrink-0",
							!isTogglingStarred && "hover:bg-yellow-400/10",
						)}
						onClick={() =>
							toggleStarred(
								{
									courseId,
								},
								{
									onSuccess: () => {
										queryClient.invalidateQueries([
											TanstackKeys.Courses,
											courseId,
										]);
										queryClient.invalidateQueries([
											TanstackKeys.StarredCourses,
											TanstackKeys.UnstarredCourses,
										]);
									},
								},
							)
						}
					>
						<AnimatePresence>
							{isTogglingStarred && (
								<m.div
									initial={{ rotate: 90, scale: 0, opacity: 0 }}
									animate={{ rotate: 0, scale: 1, opacity: 1 }}
									exit={{ scale: 0, opacity: 0 }}
									transition={{ duration: 0.2 }}
									className={
										"absolute w-6 h-6 flex items-center justify-center"
									}
								>
									<Loader className={"m-1"} />
								</m.div>
							)}
						</AnimatePresence>
						<AnimatePresence initial={false}>
							{!isTogglingStarred && (
								<m.div
									initial={{ rotate: -90, scale: 0, opacity: 0 }}
									animate={{ rotate: 0, scale: 1, opacity: 1 }}
									exit={{
										rotate: 90,
										scale: 0,
										opacity: 0,
										transition: { duration: 0.2 },
									}}
									className={
										"absolute w-6 h-6 flex items-center justify-center"
									}
								>
									<Star
										className={cn(
											"w-6 h-6 dark:text-yellow-400 text-yellow-600 shrink-0",
											starredCourse && "fill-yellow-600 dark:fill-yellow-400",
										)}
									/>
								</m.div>
							)}
						</AnimatePresence>
					</Button>
					<Link
						className="my-auto flex w-fit items-center text-lg font-semibold text-balance"
						to="."
					>
						<CourseNavigationMenu title={courseTitle} />
					</Link>
				</div>
				<p className="my-auto ml-6 text-sm text-gray-500 text-nowrap dark:text-gray-400">
					{courseCode}
				</p>
			</div>
		</header>
	);
}
