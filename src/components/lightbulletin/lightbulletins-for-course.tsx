import LightbulletinCard from "@/components/lightbulletin/lightbulletin-card.tsx";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import useGETlightbulletinsForCourse from "@/queries/lightbulletin-course/useGETlightbulletinsForCourse.ts";
import * as linkify from "linkifyjs";
import { ArrowDownNarrowWide, ArrowUpNarrowWide, Calendar, CalendarDays, CalendarRange, Filter, Inbox, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type DateFilter = "all" | "today" | "week" | "month";
type SortOrder = "newest" | "oldest";

export default function LightbulletinsForCourse({
	courseId,
}: {
	courseId: number;
}) {
	const [dateFilter, setDateFilter] = useState<DateFilter>("all");
	const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

	const { data } = useGETlightbulletinsForCourse(
		{
			courseId: courseId,
		},
		{
			suspense: true,
		},
	);

	const filteredAndSortedBulletins = useMemo(() => {
		if (!data?.EntityArray) return [];

		let bulletins = [...data.EntityArray];

		// Apply date filter
		const now = new Date();
		const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
		const startOfWeek = new Date(startOfToday);
		startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
		const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

		if (dateFilter === "today") {
			bulletins = bulletins.filter(b => new Date(b.PublishedDate) >= startOfToday);
		} else if (dateFilter === "week") {
			bulletins = bulletins.filter(b => new Date(b.PublishedDate) >= startOfWeek);
		} else if (dateFilter === "month") {
			bulletins = bulletins.filter(b => new Date(b.PublishedDate) >= startOfMonth);
		}

		// Apply sort order
		bulletins.sort((a, b) => {
			const dateA = new Date(a.PublishedDate).getTime();
			const dateB = new Date(b.PublishedDate).getTime();
			return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
		});

		return bulletins;
	}, [data?.EntityArray, dateFilter, sortOrder]);

	const hasActiveFilters = dateFilter !== "all" || sortOrder !== "newest";

	const dateFilterLabels: Record<DateFilter, { label: string; icon: React.ElementType }> = {
		all: { label: "All Time", icon: CalendarRange },
		today: { label: "Today", icon: Calendar },
		week: { label: "This Week", icon: CalendarDays },
		month: { label: "This Month", icon: CalendarRange },
	};

	const resetFilters = () => {
		setDateFilter("all");
		setSortOrder("newest");
	};

	return (
		<div className="space-y-4">
			{/* Filter Bar */}
			<div className="flex items-center gap-2 flex-wrap">
				{/* Date Filter */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant={dateFilter !== "all" ? "default" : "outline"}
							size="sm"
							className={cn(
								"h-8 gap-1.5 text-xs",
								dateFilter !== "all" && "bg-primary/90 hover:bg-primary"
							)}
						>
							{(() => {
								const Icon = dateFilterLabels[dateFilter].icon;
								return <Icon className="w-3.5 h-3.5" />;
							})()}
							{dateFilterLabels[dateFilter].label}
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start" className="w-40">
						<DropdownMenuLabel className="text-xs">Filter by Date</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							{(Object.keys(dateFilterLabels) as DateFilter[]).map((key) => {
								const { label, icon: Icon } = dateFilterLabels[key];
								return (
									<DropdownMenuItem
										key={key}
										onClick={() => setDateFilter(key)}
										className={cn(
											"text-xs gap-2",
											dateFilter === key && "bg-accent"
										)}
									>
										<Icon className="w-3.5 h-3.5" />
										{label}
									</DropdownMenuItem>
								);
							})}
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>

				{/* Sort Order */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant={sortOrder !== "newest" ? "default" : "outline"}
							size="sm"
							className={cn(
								"h-8 gap-1.5 text-xs",
								sortOrder !== "newest" && "bg-primary/90 hover:bg-primary"
							)}
						>
							{sortOrder === "newest" ? (
								<ArrowDownNarrowWide className="w-3.5 h-3.5" />
							) : (
								<ArrowUpNarrowWide className="w-3.5 h-3.5" />
							)}
							{sortOrder === "newest" ? "Newest First" : "Oldest First"}
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start" className="w-40">
						<DropdownMenuLabel className="text-xs">Sort Order</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem
								onClick={() => setSortOrder("newest")}
								className={cn("text-xs gap-2", sortOrder === "newest" && "bg-accent")}
							>
								<ArrowDownNarrowWide className="w-3.5 h-3.5" />
								Newest First
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => setSortOrder("oldest")}
								className={cn("text-xs gap-2", sortOrder === "oldest" && "bg-accent")}
							>
								<ArrowUpNarrowWide className="w-3.5 h-3.5" />
								Oldest First
							</DropdownMenuItem>
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>

				{/* Reset Filters */}
				{hasActiveFilters && (
					<Button
						variant="ghost"
						size="sm"
						onClick={resetFilters}
						className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
					>
						<RotateCcw className="w-3 h-3" />
						Reset
					</Button>
				)}

				{/* Results Count */}
				<div className="ml-auto text-xs text-muted-foreground">
					{filteredAndSortedBulletins.length} {filteredAndSortedBulletins.length === 1 ? "announcement" : "announcements"}
				</div>
			</div>

			{/* Announcements List */}
			{filteredAndSortedBulletins.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-12 text-center">
					<div className="flex items-center justify-center w-12 h-12 rounded-xl bg-secondary/50 mb-3">
						<Inbox className="w-6 h-6 text-muted-foreground" />
					</div>
					<p className="text-sm font-medium text-foreground mb-1">No announcements found</p>
					<p className="text-xs text-muted-foreground mb-4">
						{dateFilter !== "all"
							? "Try adjusting your filters to see more results"
							: "No announcements have been posted yet"
						}
					</p>
					{hasActiveFilters && (
						<Button
							variant="outline"
							size="sm"
							onClick={resetFilters}
							className="text-xs"
						>
							<RotateCcw className="w-3 h-3 mr-1.5" />
							Clear Filters
						</Button>
					)}
				</div>
			) : (
				<div className="flex flex-col gap-4">
					{filteredAndSortedBulletins.map((bulletin, idx) => {
						// find the date of the previous bulletin and compare it to the current one
						const previousBulletin = filteredAndSortedBulletins[idx - 1];
						const hasNextBulletin = previousBulletin !== undefined;
						const previousBulletinDate = hasNextBulletin
							? new Date(previousBulletin.PublishedDate)
							: null;
						const currentBulletinDate = new Date(bulletin.PublishedDate);
						const shouldMakeNewHeader =
							previousBulletinDate === null ||
							previousBulletinDate.getMonth() !== currentBulletinDate.getMonth();
						const showYear =
							currentBulletinDate.getFullYear() !== new Date().getFullYear();

						return (
							<div key={bulletin.LightBulletinId}>
								{shouldMakeNewHeader && hasNextBulletin && (
									<div className="flex items-center gap-3 py-4">
										<div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
										<span className="text-xs font-medium text-muted-foreground px-2">
											{currentBulletinDate.toLocaleString("default", {
												month: "long",
												year: showYear ? "numeric" : undefined,
											})}
										</span>
										<div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
									</div>
								)}
								<LightbulletinCard
									links={linkify.find(bulletin.Text)}
									bulletin={bulletin}
								/>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
