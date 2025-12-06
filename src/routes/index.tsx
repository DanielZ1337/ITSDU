import CourseCardStarredSelect from "@/components/course/course-card/course-card-starred-select.tsx";
import CourseCards from "@/components/course/course-card/course-cards.tsx";
import CourseSearchDialog from "@/components/course/course-search-dialog";
import CourseSortSelect from "@/components/course/course-sort-select.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, isMacOS } from "@/lib/utils";
import {
	CourseCardsSortByTypes,
	CourseCardsSortByTypesConst,
} from "@/types/api-types/extra/course-cards-sort-by-types.ts";
import {
	CourseCardsSelectOptions,
	CourseCardsSelectOptionsEnum,
} from "@/types/course-cards-select-options.ts";
import { useDebounce } from "@uidotdev/usehooks";
import { motion } from "framer-motion";
import { GraduationCap, Search } from "lucide-react";
import { Suspense, useRef, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Helmet } from "react-helmet-async";

export default function Index() {
	const [searchInput, setSearchInput] = useState<string>("");
	const debouncedSearchTerm = useDebounce(searchInput, 100);
	const [selectedRankedBy, setSelectedRankedBy] =
		useState<CourseCardsSortByTypes>(CourseCardsSortByTypesConst[0]);
	const [selectedStarredOption, setSelectedStarredOption] =
		useState<CourseCardsSelectOptions>(CourseCardsSelectOptionsEnum.Starred);
	const cardsRef = useRef<HTMLDivElement>(null);

	return (
		<div className="flex flex-col flex-1 h-full w-full">
			<Helmet>
				<title>itslearning</title>
			</Helmet>

			{/* Header section */}
			<div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border/50">
				<div className="px-4 sm:px-6 lg:px-8 py-6">
					{/* Title and search row */}
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
						<div className="flex items-center gap-3">
							<div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
								<GraduationCap className="w-5 h-5 text-primary" />
							</div>
							<h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
								Courses
							</h1>
						</div>

						{/* Search and filters */}
						<div className="flex flex-wrap items-center gap-3">
							<div className="relative flex-1 sm:flex-initial sm:w-64">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
								<Input
									placeholder="Search courses..."
									value={searchInput}
									onChange={(e) => setSearchInput(e.target.value)}
									className="pl-9 pr-16 h-9 bg-secondary/50 border-0 focus-visible:ring-1"
									autoFocus
								/>
								<kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border font-mono font-medium bg-background px-1.5 text-[10px] sm:flex">
									<span>{isMacOS() ? "⌘" : "Ctrl"}</span>K
								</kbd>
							</div>
							<CourseSortSelect
								selectedRankedBy={selectedRankedBy}
								setSelectedRankedBy={setSelectedRankedBy}
							/>
							<CourseCardStarredSelect
								selectedStarredOption={selectedStarredOption}
								setSelectedStarredOption={setSelectedStarredOption}
							/>
						</div>
					</div>

					{/* Search indicator */}
					{searchInput.length > 0 && (
						<motion.div
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							className="mt-4 flex items-center gap-2"
						>
							<span className="text-sm text-muted-foreground">
								Showing results for
							</span>
							<span className="text-sm font-medium text-foreground px-2 py-0.5 rounded-md bg-secondary">
								"{searchInput}"
							</span>
						</motion.div>
					)}
				</div>
			</div>

			{/* Course cards grid */}
			<div className="flex-1 overflow-auto" ref={cardsRef}>
				<ErrorBoundary
					fallback={
						<div className="w-full px-4 py-6">
							<CourseCardSkeletonGrid />
						</div>
					}
				>
					<Suspense
						fallback={
							<div className="w-full px-4 py-6">
								<CourseCardSkeletonGrid />
							</div>
						}
					>
						<CourseCards
							config={{
								PageSize: 24,
								isShowMore: false,
								PageIndex: 0,
								sortBy: selectedRankedBy,
								searchText: debouncedSearchTerm,
							}}
							courseCardTypes={selectedStarredOption}
						/>
					</Suspense>
				</ErrorBoundary>
			</div>

			<CourseSearchDialog
				searchInput={debouncedSearchTerm}
				setSearchInput={setSearchInput}
			/>
		</div>
	);
}

function CourseCardSkeleton({ index = 0 }: { index?: number }) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3, delay: index * 0.05 }}
			className={cn(
				"relative flex flex-col w-full",
				"bg-card dark:bg-card/80 rounded-xl overflow-hidden",
				"border border-border/50",
			)}
		>
			{/* Top accent bar skeleton */}
			<Skeleton className="absolute inset-x-0 top-0 h-1 rounded-t-xl" />

			<div className="p-4 space-y-3">
				{/* Header */}
				<div className="flex items-start justify-between gap-3">
					<div className="flex-1 space-y-2">
						<Skeleton className="h-4 w-3/4" />
						<Skeleton className="h-3 w-1/2" />
					</div>
					<Skeleton className="w-8 h-8 rounded-full shrink-0" />
				</div>

				{/* Spacer */}
				<div className="h-6" />

				{/* Footer */}
				<div className="flex items-center gap-2 pt-2 border-t border-border/50">
					<Skeleton className="h-6 w-14 rounded-lg" />
					<Skeleton className="h-6 w-14 rounded-lg" />
					<Skeleton className="h-6 w-14 rounded-lg" />
				</div>
			</div>
		</motion.div>
	);
}

function CourseCardSkeletonGrid() {
	return (
		<div className="space-y-6">
			{/* Section header skeleton */}
			<div className="flex items-center gap-3 mb-6">
				<Skeleton className="w-10 h-10 rounded-xl" />
				<div className="space-y-1">
					<Skeleton className="h-6 w-32" />
				</div>
			</div>

			{/* Grid */}
			<div className={cn(
				"grid gap-4",
				"grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5",
			)}>
				{Array.from({ length: 8 }).map((_, i) => (
					<CourseCardSkeleton key={i} index={i} />
				))}
			</div>
		</div>
	);
}
