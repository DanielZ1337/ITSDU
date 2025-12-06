import CourseCard from "@/components/course/course-card/course-card.tsx";
import { cn } from "@/lib/utils.ts";
import useGETcourses from "@/queries/course-cards/useGETcourses.ts";
import { GETstarredCoursesParams } from "@/types/api-types/course-cards/GETstarredCourses.ts";
import { GETunstarredCoursesParams } from "@/types/api-types/course-cards/GETunstarredCourses.ts";
import { BookOpen, GraduationCap, Star } from "lucide-react";

function EmptyState({
	type,
	icon: Icon
}: {
	type: "starred" | "unstarred" | "all";
	icon: React.ElementType;
}) {
	const messages = {
		starred: {
			title: "No starred courses",
			description: "Star your favorite courses for quick access",
		},
		unstarred: {
			title: "No unstarred courses",
			description: "All your courses are starred!",
		},
		all: {
			title: "No courses yet",
			description: "Your courses will appear here once you're enrolled",
		},
	};

	const { title, description } = messages[type];

	return (
		<div className="flex flex-col items-center justify-center py-16 px-4">
			<div className={cn(
				"flex items-center justify-center w-16 h-16 rounded-2xl mb-4",
				"bg-secondary/50 dark:bg-secondary/30",
			)}>
				<Icon className="w-8 h-8 text-muted-foreground" />
			</div>
			<h3 className="text-lg font-semibold text-foreground mb-1">
				{title}
			</h3>
			<p className="text-sm text-muted-foreground text-center max-w-xs">
				{description}
			</p>
		</div>
	);
}

function SectionHeader({
	icon: Icon,
	title,
	count,
	isStarred = false,
}: {
	icon: React.ElementType;
	title: string;
	count: number;
	isStarred?: boolean;
}) {
	return (
		<div className="flex items-center gap-3 mb-6">
			<div className={cn(
				"flex items-center justify-center w-10 h-10 rounded-xl",
				isStarred
					? "bg-yellow-500/10 dark:bg-yellow-500/20"
					: "bg-secondary/50 dark:bg-secondary/30",
			)}>
				<Icon className={cn(
					"w-5 h-5",
					isStarred
						? "text-yellow-600 dark:text-yellow-400"
						: "text-muted-foreground",
				)} />
			</div>
			<div className="flex items-baseline gap-2">
				<h2 className="text-xl font-semibold text-foreground tracking-tight">
					{title}
				</h2>
				<span className="text-sm text-muted-foreground">
					({count})
				</span>
			</div>
		</div>
	);
}

function CourseGrid({ children }: { children: React.ReactNode }) {
	return (
		<div className={cn(
			"grid gap-4",
			"grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5",
		)}>
			{children}
		</div>
	);
}

export default function CourseCards({
	config,
	courseCardTypes,
}: {
	courseCardTypes: "Starred" | "Unstarred" | "All";
	config: GETstarredCoursesParams | GETunstarredCoursesParams;
}) {
	const { data } = useGETcourses(
		courseCardTypes,
		{
			...config,
		},
		{
			suspense: true,
		},
	);

	const starredCourses = data?.EntityArray.filter(
		(course) => course.IsFavouriteCourse,
	) ?? [];
	const unstarredCourses = data?.EntityArray.filter(
		(course) => !course.IsFavouriteCourse,
	) ?? [];

	if (data?.EntityArray.length === 0) {
		return <EmptyState type="all" icon={GraduationCap} />;
	}

	return (
		<div className="w-full px-4 py-6 space-y-10">
			{/* Starred courses section */}
			{courseCardTypes === "Starred" && (
				<section>
					{starredCourses.length === 0 ? (
						<EmptyState type="starred" icon={Star} />
					) : (
						<>
							<SectionHeader
								icon={Star}
								title="Starred Courses"
								count={starredCourses.length}
								isStarred
							/>
							<CourseGrid>
								{starredCourses.map((course) => (
									<CourseCard key={course.CourseId} card={course} />
								))}
							</CourseGrid>
						</>
					)}
				</section>
			)}

			{/* Unstarred courses section */}
			{courseCardTypes === "Unstarred" && (
				<section>
					{unstarredCourses.length === 0 ? (
						<EmptyState type="unstarred" icon={BookOpen} />
					) : (
						<>
							<SectionHeader
								icon={BookOpen}
								title="Unstarred Courses"
								count={unstarredCourses.length}
							/>
							<CourseGrid>
								{unstarredCourses.map((course) => (
									<CourseCard key={course.CourseId} card={course} />
								))}
							</CourseGrid>
						</>
					)}
				</section>
			)}

			{/* All courses - combined view */}
			{courseCardTypes === "All" && (
				<div className="space-y-10">
					{/* Starred section */}
					{starredCourses.length > 0 && (
						<section>
							<SectionHeader
								icon={Star}
								title="Starred Courses"
								count={starredCourses.length}
								isStarred
							/>
							<CourseGrid>
								{starredCourses.map((course) => (
									<CourseCard key={course.CourseId} card={course} />
								))}
							</CourseGrid>
						</section>
					)}

					{/* Unstarred section */}
					{unstarredCourses.length > 0 && (
						<section>
							<SectionHeader
								icon={BookOpen}
								title="Unstarred Courses"
								count={unstarredCourses.length}
							/>
							<CourseGrid>
								{unstarredCourses.map((course) => (
									<CourseCard key={course.CourseId} card={course} />
								))}
							</CourseGrid>
						</section>
					)}
				</div>
			)}
		</div>
	);
}
