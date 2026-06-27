import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useSettings } from "@/hooks/atoms/useSettings";
import {
	type CalendarAgendaGroup,
	type NormalizedCalendarEvent,
	buildMonthGrid,
	formatDuration,
	formatEventTimeRange,
	getDateEvents,
	getWeekDays,
	groupAgendaEvents,
	normalizeCalendarEvent,
	normalizeCalendarEvents,
} from "@/lib/calendar/calendar-events";
import { cn } from "@/lib/utils";
import useGETcalendarEvent from "@/queries/calendar/useGETcalendarEvent";
import useGETcalendarEvents from "@/queries/calendar/useGETcalendarEvents";
import useGETcourses from "@/queries/course-cards/useGETcourses";
import type { CalendarViewSetting } from "@/types/settings";
import {
	addDays,
	addMonths,
	addWeeks,
	format,
	isSameDay,
	isSameMonth,
	startOfDay,
	startOfMonth,
	startOfWeek,
} from "date-fns";
import {
	AlertTriangle,
	ArrowLeft,
	ArrowRight,
	CalendarDays,
	Clock,
	Copy,
	ExternalLink,
	GraduationCap,
	ListFilter,
	MapPin,
	RefreshCcw,
	Search,
} from "lucide-react";
import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { toast } from "sonner";

type CalendarProps = {
	events?: unknown[];
	isLoading?: boolean;
	views?: CalendarViewSetting[];
	defaultView?: CalendarViewSetting;
	showToolbar?: boolean;
	showHeader?: boolean;
	className?: string;
};

const viewLabels: Record<CalendarViewSetting, string> = {
	month: "Month",
	week: "Week",
	day: "Day",
	agenda: "Agenda",
};

const pageSize = 80 as const;

export default function CalendarIndex() {
	return (
		<>
			<Helmet>
				<title>Calendar</title>
			</Helmet>
			<CalendarPlanner />
		</>
	);
}

export function Calendar({
	events,
	isLoading,
	views,
	defaultView,
	showToolbar = true,
	showHeader = true,
	className,
}: CalendarProps) {
	return (
		<CalendarPlanner
			externalEvents={events}
			externalIsLoading={isLoading}
			allowedViews={views}
			defaultViewOverride={defaultView}
			showToolbar={showToolbar}
			showHeader={showHeader}
			className={className}
		/>
	);
}

function CalendarPlanner({
	externalEvents,
	externalIsLoading,
	allowedViews,
	defaultViewOverride,
	showToolbar = true,
	showHeader = true,
	className,
}: {
	externalEvents?: unknown[];
	externalIsLoading?: boolean;
	allowedViews?: CalendarViewSetting[];
	defaultViewOverride?: CalendarViewSetting;
	showToolbar?: boolean;
	showHeader?: boolean;
	className?: string;
}) {
	const { settings, isHydrated } = useSettings();
	const availableViews = allowedViews ?? ["month", "week", "day", "agenda"];
	const [view, setView] = useState<CalendarViewSetting>(
		defaultViewOverride ?? settings.calendarDefaultView,
	);
	const [anchorDate, setAnchorDate] = useState(() => new Date());
	const [selectedDay, setSelectedDay] = useState(() => startOfDay(new Date()));
	const [search, setSearch] = useState("");
	const [courseFilter, setCourseFilter] = useState("all");
	const [selectedEvent, setSelectedEvent] =
		useState<NormalizedCalendarEvent | null>(null);
	const hydratedDefaultView = useRef(false);

	useEffect(() => {
		if (!isHydrated || hydratedDefaultView.current || defaultViewOverride)
			return;
		hydratedDefaultView.current = true;
		setView(settings.calendarDefaultView);
	}, [defaultViewOverride, isHydrated, settings.calendarDefaultView]);

	const fetchStart = useMemo(
		() =>
			getFetchStartDate(
				view,
				anchorDate,
				settings.calendarWeekStartsOn,
				selectedDay,
			),
		[anchorDate, selectedDay, settings.calendarWeekStartsOn, view],
	);

	const calendarQuery = useGETcalendarEvents(
		{ fromDate: fetchStart, page: 0, pageSize },
		{
			enabled: externalEvents === undefined,
			keepPreviousData: true,
			staleTime: 1000 * 60 * 5,
			suspense: false,
		},
	);

	const coursesQuery = useGETcourses(
		"All",
		{ PageIndex: 0, PageSize: pageSize, sortBy: "Title", isShowMore: false },
		{
			enabled: externalEvents === undefined,
			suspense: false,
			staleTime: 1000 * 60 * 10,
		},
	);

	const courseTitleById = useMemo(() => {
		const map = new Map<number, string>();
		for (const course of coursesQuery.data?.EntityArray ?? []) {
			map.set(course.CourseId, course.Title);
		}
		return map;
	}, [coursesQuery.data]);

	const rawEvents = externalEvents ?? calendarQuery.data?.EntityArray ?? [];
	const allEvents = useMemo(
		() => normalizeCalendarEvents(rawEvents, { courseTitleById }),
		[courseTitleById, rawEvents],
	);

	const courseOptions = useMemo(() => {
		const map = new Map<number, string>();
		for (const event of allEvents) {
			if (event.courseId) {
				map.set(
					event.courseId,
					event.courseTitle ?? event.location ?? `Course ${event.courseId}`,
				);
			}
		}
		return Array.from(map.entries())
			.map(([id, title]) => ({ id, title }))
			.sort((a, b) => a.title.localeCompare(b.title));
	}, [allEvents]);

	const filteredEvents = useMemo(() => {
		const normalizedSearch = search.trim().toLowerCase();
		return allEvents.filter((event) => {
			const matchesCourse =
				courseFilter === "all" || String(event.courseId) === courseFilter;
			const haystack = [
				event.title,
				event.courseTitle,
				event.location,
				event.description,
				event.importDescription,
			]
				.filter(Boolean)
				.join(" ")
				.toLowerCase();
			return (
				matchesCourse &&
				(normalizedSearch.length === 0 || haystack.includes(normalizedSearch))
			);
		});
	}, [allEvents, courseFilter, search]);

	const selectedDayEvents = useMemo(
		() => getDateEvents(filteredEvents, selectedDay),
		[filteredEvents, selectedDay],
	);

	const todayEvents = useMemo(
		() => getDateEvents(filteredEvents, new Date()),
		[filteredEvents],
	);

	const upcomingCount = useMemo(() => {
		const now = new Date();
		return filteredEvents.filter(
			(event) => event.startsAt && event.endsAt && event.endsAt >= now,
		).length;
	}, [filteredEvents]);

	const isLoading =
		externalEvents === undefined
			? calendarQuery.isLoading
			: Boolean(externalIsLoading);
	const isFetching =
		externalEvents === undefined ? calendarQuery.isFetching : false;
	const isError = externalEvents === undefined ? calendarQuery.isError : false;
	const error = externalEvents === undefined ? calendarQuery.error : undefined;

	const setPlannerView = (nextView: CalendarViewSetting) => {
		setView(nextView);
		if (nextView === "day") {
			setAnchorDate(selectedDay);
		}
	};

	const goToToday = () => {
		const today = new Date();
		setAnchorDate(today);
		setSelectedDay(startOfDay(today));
	};

	const navigatePeriod = (direction: -1 | 1) => {
		const nextDate = getNextPeriodDate(view, anchorDate, direction);
		setAnchorDate(nextDate);
		if (view === "day" || view === "agenda") {
			setSelectedDay(startOfDay(nextDate));
		}
	};

	return (
		<div
			className={cn(
				"mx-auto flex h-full min-h-0 w-full max-w-7xl flex-col gap-4 p-4 pb-12 sm:p-6 lg:p-8",
				className,
			)}
		>
			{showHeader && (
				<CalendarHero
					view={view}
					anchorDate={anchorDate}
					todayEvents={todayEvents.length}
					upcomingEvents={upcomingCount}
					isFetching={isFetching}
				/>
			)}

			{showToolbar && (
				<CalendarToolbar
					view={view}
					availableViews={availableViews}
					anchorDate={anchorDate}
					search={search}
					courseFilter={courseFilter}
					courseOptions={courseOptions}
					onSearchChange={setSearch}
					onCourseFilterChange={setCourseFilter}
					onViewChange={setPlannerView}
					onToday={goToToday}
					onPrevious={() => navigatePeriod(-1)}
					onNext={() => navigatePeriod(1)}
				/>
			)}

			{isLoading ? (
				<CalendarSkeleton />
			) : isError ? (
				<CalendarError
					error={error}
					onRetry={() => void calendarQuery.refetch()}
				/>
			) : (
				<div className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
					<section className="min-h-0 rounded-xl border bg-card">
						{view === "month" && (
							<MonthView
								anchorDate={anchorDate}
								events={filteredEvents}
								selectedDay={selectedDay}
								weekStartsOn={settings.calendarWeekStartsOn}
								showWeekends={settings.calendarShowWeekends}
								onSelectDay={setSelectedDay}
								onOpenEvent={setSelectedEvent}
							/>
						)}
						{view === "week" && (
							<WeekView
								anchorDate={anchorDate}
								events={filteredEvents}
								selectedDay={selectedDay}
								weekStartsOn={settings.calendarWeekStartsOn}
								showWeekends={settings.calendarShowWeekends}
								onSelectDay={setSelectedDay}
								onOpenEvent={setSelectedEvent}
							/>
						)}
						{view === "day" && (
							<DayView
								date={selectedDay}
								events={selectedDayEvents}
								onOpenEvent={setSelectedEvent}
							/>
						)}
						{view === "agenda" && (
							<AgendaView
								events={filteredEvents}
								onOpenEvent={setSelectedEvent}
							/>
						)}
					</section>

					<DaySidePanel
						date={selectedDay}
						events={selectedDayEvents}
						onOpenEvent={setSelectedEvent}
					/>
				</div>
			)}

			<EventDetailDrawer
				event={selectedEvent}
				onClose={() => setSelectedEvent(null)}
			/>
		</div>
	);
}

function CalendarHero({
	view,
	anchorDate,
	todayEvents,
	upcomingEvents,
	isFetching,
}: {
	view: CalendarViewSetting;
	anchorDate: Date;
	todayEvents: number;
	upcomingEvents: number;
	isFetching: boolean;
}) {
	return (
		<header className="rounded-xl border bg-card p-5 sm:p-6">
			<div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
				<div className="min-w-0">
					<div className="flex flex-wrap items-center gap-2">
						<Badge variant="outline" className="gap-1.5 font-normal">
							<CalendarDays className="h-3.5 w-3.5" />
							{viewLabels[view]}
						</Badge>
						{isFetching && (
							<Badge variant="outline" className="font-normal">
								Syncing...
							</Badge>
						)}
					</div>
					<h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
						{getPeriodLabel(view, anchorDate)}
					</h1>
					<p className="mt-1 text-sm text-muted-foreground">
						{format(new Date(), "EEEE, MMMM d")} · {todayEvents} today ·{" "}
						{upcomingEvents} upcoming
					</p>
				</div>

				<div className="grid grid-cols-2 gap-2 text-sm sm:flex">
					<SummaryPill label="Today" value={todayEvents} />
					<SummaryPill label="Upcoming" value={upcomingEvents} />
				</div>
			</div>
		</header>
	);
}

function SummaryPill({ label, value }: { label: string; value: number }) {
	return (
		<div className="rounded-lg border bg-background px-3 py-2">
			<p className="text-xs text-muted-foreground">{label}</p>
			<p className="text-lg font-semibold leading-tight">{value}</p>
		</div>
	);
}

function CalendarToolbar({
	view,
	availableViews,
	anchorDate,
	search,
	courseFilter,
	courseOptions,
	onSearchChange,
	onCourseFilterChange,
	onViewChange,
	onToday,
	onPrevious,
	onNext,
}: {
	view: CalendarViewSetting;
	availableViews: CalendarViewSetting[];
	anchorDate: Date;
	search: string;
	courseFilter: string;
	courseOptions: { id: number; title: string }[];
	onSearchChange: (value: string) => void;
	onCourseFilterChange: (value: string) => void;
	onViewChange: (view: CalendarViewSetting) => void;
	onToday: () => void;
	onPrevious: () => void;
	onNext: () => void;
}) {
	return (
		<section className="flex flex-col gap-3 rounded-xl border bg-card p-3">
			<div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
				<div className="flex flex-wrap items-center gap-2">
					<Button type="button" variant="outline" size="sm" onClick={onToday}>
						Today
					</Button>
					<div className="flex rounded-md border bg-background">
						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="h-8 w-8 rounded-r-none"
							onClick={onPrevious}
						>
							<ArrowLeft className="h-4 w-4" />
							<span className="sr-only">Previous period</span>
						</Button>
						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="h-8 w-8 rounded-l-none"
							onClick={onNext}
						>
							<ArrowRight className="h-4 w-4" />
							<span className="sr-only">Next period</span>
						</Button>
					</div>
					<p className="text-sm font-medium text-muted-foreground">
						{format(anchorDate, "MMM d, yyyy")}
					</p>
				</div>

				<div className="flex flex-wrap gap-1 rounded-md border bg-background p-1">
					{availableViews.map((calendarView) => (
						<Button
							key={calendarView}
							type="button"
							size="sm"
							variant={view === calendarView ? "secondary" : "ghost"}
							className="h-7 px-3"
							onClick={() => onViewChange(calendarView)}
						>
							{viewLabels[calendarView]}
						</Button>
					))}
				</div>
			</div>

			<div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_220px]">
				<div className="relative">
					<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						value={search}
						onChange={(event) => onSearchChange(event.target.value)}
						placeholder="Search events, locations, descriptions..."
						className="pl-9"
					/>
				</div>
				<Select value={courseFilter} onValueChange={onCourseFilterChange}>
					<SelectTrigger>
						<ListFilter className="mr-2 h-4 w-4 text-muted-foreground" />
						<SelectValue placeholder="Filter by course" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All courses</SelectItem>
						{courseOptions.map((course) => (
							<SelectItem key={course.id} value={String(course.id)}>
								{course.title}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
		</section>
	);
}

function MonthView({
	anchorDate,
	events,
	selectedDay,
	weekStartsOn,
	showWeekends,
	onSelectDay,
	onOpenEvent,
}: {
	anchorDate: Date;
	events: NormalizedCalendarEvent[];
	selectedDay: Date;
	weekStartsOn: "monday" | "sunday";
	showWeekends: boolean;
	onSelectDay: (date: Date) => void;
	onOpenEvent: (event: NormalizedCalendarEvent) => void;
}) {
	const weeks = useMemo(
		() => buildMonthGrid(anchorDate, weekStartsOn, showWeekends),
		[anchorDate, showWeekends, weekStartsOn],
	);
	const columns = weeks[0]?.length ?? (showWeekends ? 7 : 5);

	return (
		<div className="flex min-h-0 flex-col">
			<div
				className="grid border-b bg-muted/20 text-xs font-medium text-muted-foreground"
				style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
			>
				{weeks[0]?.map((day) => (
					<div key={day.toISOString()} className="px-3 py-2">
						{format(day, "EEE")}
					</div>
				))}
			</div>
			<div className="flex flex-col">
				{weeks.map((week) => (
					<div
						key={week[0]?.toISOString()}
						className="grid border-b last:border-b-0"
						style={{
							gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
						}}
					>
						{week.map((day) => {
							const dayEvents = getDateEvents(events, day);
							const visible = dayEvents.slice(0, 3);
							const more = Math.max(0, dayEvents.length - visible.length);
							const isSelected = isSameDay(day, selectedDay);
							const isCurrentMonth = isSameMonth(day, anchorDate);
							return (
								<div
									key={day.toISOString()}
									role="button"
									tabIndex={0}
									onClick={() => onSelectDay(startOfDay(day))}
									onKeyDown={(keyboardEvent) => {
										if (
											keyboardEvent.key === "Enter" ||
											keyboardEvent.key === " "
										) {
											keyboardEvent.preventDefault();
											onSelectDay(startOfDay(day));
										}
									}}
									className={cn(
										"min-h-[116px] min-w-0 border-r p-2 text-left last:border-r-0 transition-colors hover:bg-accent/60",
										!isCurrentMonth && "bg-muted/20 text-muted-foreground",
										isSelected &&
											"bg-primary/5 ring-1 ring-inset ring-primary/40",
									)}
								>
									<div className="mb-2 flex items-center justify-between">
										<span
											className={cn(
												"flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium",
												isSameDay(day, new Date()) &&
													"bg-primary text-primary-foreground",
											)}
										>
											{format(day, "d")}
										</span>
										{dayEvents.length > 0 && (
											<span className="text-xs text-muted-foreground">
												{dayEvents.length}
											</span>
										)}
									</div>
									<div className="flex flex-col gap-1">
										{visible.map((event) => (
											<EventChip
												key={event.id}
												event={event}
												onOpen={() => onOpenEvent(event)}
											/>
										))}
										{more > 0 && (
											<span className="truncate rounded bg-muted px-2 py-1 text-xs text-muted-foreground">
												+{more} more
											</span>
										)}
									</div>
								</div>
							);
						})}
					</div>
				))}
			</div>
		</div>
	);
}

function WeekView({
	anchorDate,
	events,
	selectedDay,
	weekStartsOn,
	showWeekends,
	onSelectDay,
	onOpenEvent,
}: {
	anchorDate: Date;
	events: NormalizedCalendarEvent[];
	selectedDay: Date;
	weekStartsOn: "monday" | "sunday";
	showWeekends: boolean;
	onSelectDay: (date: Date) => void;
	onOpenEvent: (event: NormalizedCalendarEvent) => void;
}) {
	const days = useMemo(
		() => getWeekDays(anchorDate, weekStartsOn, showWeekends),
		[anchorDate, showWeekends, weekStartsOn],
	);

	return (
		<div className="min-h-[520px] overflow-x-auto">
			<div
				className="grid min-w-[720px]"
				style={{
					gridTemplateColumns: `repeat(${days.length}, minmax(150px, 1fr))`,
				}}
			>
				{days.map((day) => {
					const dayEvents = getDateEvents(events, day);
					const isSelected = isSameDay(day, selectedDay);
					return (
						<div
							key={day.toISOString()}
							className="min-h-[520px] border-r last:border-r-0"
						>
							<button
								type="button"
								onClick={() => onSelectDay(startOfDay(day))}
								className={cn(
									"flex w-full items-center justify-between border-b px-3 py-3 text-left transition-colors hover:bg-accent",
									isSelected && "bg-primary/5",
								)}
							>
								<div>
									<p className="text-xs uppercase text-muted-foreground">
										{format(day, "EEE")}
									</p>
									<p
										className={cn(
											"text-lg font-semibold",
											isSameDay(day, new Date()) && "text-primary",
										)}
									>
										{format(day, "d")}
									</p>
								</div>
								<Badge variant="outline" className="font-normal">
									{dayEvents.length}
								</Badge>
							</button>
							<div className="flex flex-col gap-2 p-3">
								{dayEvents.length === 0 ? (
									<p className="rounded-md border border-dashed px-3 py-6 text-center text-xs text-muted-foreground">
										No events
									</p>
								) : (
									dayEvents.map((event) => (
										<WeekEventBlock
											key={event.id}
											event={event}
											onClick={() => onOpenEvent(event)}
										/>
									))
								)}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

function DayView({
	date,
	events,
	onOpenEvent,
}: {
	date: Date;
	events: NormalizedCalendarEvent[];
	onOpenEvent: (event: NormalizedCalendarEvent) => void;
}) {
	return (
		<div className="flex flex-col">
			<header className="border-b px-4 py-4">
				<p className="text-sm text-muted-foreground">{format(date, "EEEE")}</p>
				<h2 className="text-xl font-semibold">
					{format(date, "MMMM d, yyyy")}
				</h2>
			</header>
			<div className="p-4">
				{events.length === 0 ? (
					<EmptyState
						icon={<CalendarDays className="h-5 w-5" />}
						title="No events on this day"
						description="Move to another day or switch to Agenda for the full upcoming plan."
					/>
				) : (
					<ul className="flex flex-col gap-2">
						{events.map((event) => (
							<li key={event.id}>
								<EventListItem
									event={event}
									onClick={() => onOpenEvent(event)}
								/>
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
}

function AgendaView({
	events,
	onOpenEvent,
}: {
	events: NormalizedCalendarEvent[];
	onOpenEvent: (event: NormalizedCalendarEvent) => void;
}) {
	const groups = useMemo(() => groupAgendaEvents(events), [events]);

	if (groups.length === 0) {
		return (
			<div className="p-6">
				<EmptyState
					icon={<CalendarDays className="h-5 w-5" />}
					title="No upcoming events"
					description="Your calendar is clear for the current filter."
				/>
			</div>
		);
	}

	return (
		<div className="flex flex-col divide-y">
			{groups.map((group) => (
				<AgendaGroupView
					key={group.key}
					group={group}
					onOpenEvent={onOpenEvent}
				/>
			))}
		</div>
	);
}

function AgendaGroupView({
	group,
	onOpenEvent,
}: {
	group: CalendarAgendaGroup;
	onOpenEvent: (event: NormalizedCalendarEvent) => void;
}) {
	return (
		<section className="p-4">
			<div className="mb-3 flex items-center justify-between">
				<h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
					{group.label}
				</h3>
				<Badge variant="outline" className="font-normal">
					{group.items.length}
				</Badge>
			</div>
			<ul className="grid gap-2">
				{group.items.map((event) => (
					<li key={event.id}>
						<EventListItem event={event} onClick={() => onOpenEvent(event)} />
					</li>
				))}
			</ul>
		</section>
	);
}

function DaySidePanel({
	date,
	events,
	onOpenEvent,
}: {
	date: Date;
	events: NormalizedCalendarEvent[];
	onOpenEvent: (event: NormalizedCalendarEvent) => void;
}) {
	return (
		<aside className="hidden min-h-0 rounded-xl border bg-card xl:flex xl:flex-col">
			<header className="border-b px-4 py-4">
				<p className="text-sm text-muted-foreground">Selected day</p>
				<h2 className="text-base font-semibold">
					{format(date, "EEE, MMM d")}
				</h2>
			</header>
			<div className="min-h-0 flex-1 overflow-y-auto p-3">
				{events.length === 0 ? (
					<EmptyState
						icon={<CalendarDays className="h-5 w-5" />}
						title="No events"
						description="Select a date with event chips to see the day plan."
					/>
				) : (
					<ul className="flex flex-col gap-2">
						{events.map((event) => (
							<li key={event.id}>
								<EventListItem
									compact
									event={event}
									onClick={() => onOpenEvent(event)}
								/>
							</li>
						))}
					</ul>
				)}
			</div>
		</aside>
	);
}

function EventChip({
	event,
	onOpen,
}: {
	event: NormalizedCalendarEvent;
	onOpen: () => void;
}) {
	return (
		<span
			role="button"
			tabIndex={0}
			onClick={(clickEvent) => {
				clickEvent.stopPropagation();
				onOpen();
			}}
			onKeyDown={(keyboardEvent) => {
				if (keyboardEvent.key === "Enter" || keyboardEvent.key === " ") {
					keyboardEvent.preventDefault();
					keyboardEvent.stopPropagation();
					onOpen();
				}
			}}
			className={cn(
				"block truncate rounded border px-2 py-1 text-xs transition-colors hover:bg-accent",
				event.isPast
					? "border-muted bg-muted/40 text-muted-foreground"
					: "border-primary/20 bg-primary/10 text-primary",
			)}
		>
			{event.isTimed && event.startsAt
				? `${format(event.startsAt, "HH:mm")} `
				: ""}
			{event.title}
		</span>
	);
}

function WeekEventBlock({
	event,
	onClick,
}: {
	event: NormalizedCalendarEvent;
	onClick: () => void;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"w-full rounded-lg border p-3 text-left transition-colors hover:bg-accent",
				event.isPast ? "bg-muted/30" : "bg-background",
			)}
		>
			<p className="truncate text-sm font-medium">{event.title}</p>
			<div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
				<span className="inline-flex items-center gap-1">
					<Clock className="h-3 w-3" />
					{formatEventTimeRange(event)}
				</span>
				{event.location && (
					<span className="inline-flex min-w-0 items-center gap-1 truncate">
						<MapPin className="h-3 w-3 shrink-0" />
						<span className="truncate">{event.location}</span>
					</span>
				)}
			</div>
		</button>
	);
}

function EventListItem({
	event,
	onClick,
	compact,
}: {
	event: NormalizedCalendarEvent;
	onClick: () => void;
	compact?: boolean;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="flex w-full gap-3 rounded-lg border bg-background p-3 text-left transition-colors hover:bg-accent"
		>
			<div className="flex w-16 shrink-0 flex-col items-center rounded-md border bg-muted/30 py-2">
				<span className="text-xs font-medium text-muted-foreground">
					{event.startsAt ? format(event.startsAt, "MMM") : "---"}
				</span>
				<span className="text-lg font-semibold leading-tight">
					{event.startsAt ? format(event.startsAt, "d") : "?"}
				</span>
			</div>
			<div className="min-w-0 flex-1">
				<div className="flex items-start justify-between gap-2">
					<p className="truncate text-sm font-semibold">{event.title}</p>
					{event.isToday && (
						<Badge variant="outline" className="shrink-0 font-normal">
							Today
						</Badge>
					)}
				</div>
				<div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
					<span className="inline-flex items-center gap-1">
						<Clock className="h-3 w-3" />
						{formatEventTimeRange(event)}
					</span>
					{event.location && (
						<span className="inline-flex min-w-0 items-center gap-1 truncate">
							<MapPin className="h-3 w-3 shrink-0" />
							<span className="truncate">{event.location}</span>
						</span>
					)}
				</div>
				{!compact && (event.courseTitle || event.description) && (
					<p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
						{event.courseTitle || event.description}
					</p>
				)}
			</div>
		</button>
	);
}

function EventDetailDrawer({
	event,
	onClose,
}: {
	event: NormalizedCalendarEvent | null;
	onClose: () => void;
}) {
	const detailQuery = useGETcalendarEvent(
		{ eventId: event?.numericId ?? 0 },
		{
			enabled: Boolean(event?.numericId),
			staleTime: 1000 * 60 * 10,
			suspense: false,
		},
	);

	const detailedEvent = useMemo(() => {
		if (!event) return null;
		if (!detailQuery.data) return event;

		const normalizedDetail = normalizeCalendarEvent(detailQuery.data);
		return {
			...event,
			...normalizedDetail,
			courseId: normalizedDetail.courseId ?? event.courseId,
			courseTitle: normalizedDetail.courseTitle ?? event.courseTitle,
			location: normalizedDetail.location ?? event.location,
		};
	}, [detailQuery.data, event]);

	const copyDetails = async () => {
		if (!detailedEvent) return;
		await navigator.clipboard.writeText(formatEventDetails(detailedEvent));
		toast.success("Event details copied");
	};

	const description =
		detailedEvent?.description || detailedEvent?.importDescription || "";
	const descriptionLinks = extractSafeLinks(description);
	const duration = formatDuration(detailedEvent?.durationMinutes ?? null);

	return (
		<Sheet open={Boolean(event)} onOpenChange={(open) => !open && onClose()}>
			<SheetContent
				side="right"
				className="right-4 top-4 bottom-4 flex h-auto w-[min(560px,calc(100vw-2rem))] flex-col overflow-hidden rounded-xl border p-0 sm:max-w-none"
			>
				{detailedEvent && (
					<>
						<SheetHeader className="border-b px-5 py-4 text-left">
							<div className="flex items-start justify-between gap-4 pr-8">
								<div className="min-w-0">
									<SheetTitle className="text-xl">
										{detailedEvent.title}
									</SheetTitle>
									<SheetDescription>
										{detailedEvent.startsAt
											? format(detailedEvent.startsAt, "EEEE, MMMM d, yyyy")
											: "Date unknown"}
									</SheetDescription>
								</div>
								{detailQuery.isFetching && (
									<Badge variant="outline" className="shrink-0 font-normal">
										Loading detail
									</Badge>
								)}
							</div>
						</SheetHeader>
						<ScrollArea className="min-h-0 flex-1">
							<div className="flex flex-col gap-5 p-5 pb-8">
								<div className="grid gap-3 sm:grid-cols-2">
									<DetailMetric
										icon={<Clock className="h-4 w-4" />}
										label="Time"
										value={formatEventTimeRange(detailedEvent)}
									/>
									<DetailMetric
										icon={<CalendarDays className="h-4 w-4" />}
										label="Duration"
										value={duration ?? "Not specified"}
									/>
									<DetailMetric
										icon={<MapPin className="h-4 w-4" />}
										label="Location"
										value={detailedEvent.location ?? "No location"}
									/>
									<DetailMetric
										icon={<GraduationCap className="h-4 w-4" />}
										label="Course"
										value={detailedEvent.courseTitle ?? "No course linked"}
									/>
								</div>

								<div className="flex flex-wrap gap-2">
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() => void copyDetails()}
									>
										<Copy className="mr-2 h-3.5 w-3.5" />
										Copy details
									</Button>
									{detailedEvent.courseId && (
										<Button asChild type="button" variant="outline" size="sm">
											<Link to={`/courses/${detailedEvent.courseId}`}>
												<GraduationCap className="mr-2 h-3.5 w-3.5" />
												Open course
											</Link>
										</Button>
									)}
									{detailedEvent.eventUrl && (
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() =>
												void window.app.openExternal(detailedEvent.eventUrl!)
											}
										>
											<ExternalLink className="mr-2 h-3.5 w-3.5" />
											Open event
										</Button>
									)}
								</div>

								{detailQuery.isError && (
									<div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
										Full event details could not be loaded. The summary is still
										available.
									</div>
								)}

								<Separator />

								<section>
									<h3 className="mb-2 text-sm font-semibold">Description</h3>
									{description ? (
										<div className="whitespace-pre-wrap rounded-lg border bg-muted/20 p-4 text-sm leading-6">
											{description}
										</div>
									) : (
										<p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
											No description was provided for this event.
										</p>
									)}
									{descriptionLinks.length > 0 && (
										<div className="mt-3 flex flex-wrap gap-2">
											{descriptionLinks.map((url) => (
												<Button
													key={url}
													type="button"
													variant="outline"
													size="sm"
													onClick={() => void window.app.openExternal(url)}
												>
													<ExternalLink className="mr-2 h-3.5 w-3.5" />
													Open link
												</Button>
											))}
										</div>
									)}
								</section>

								{detailedEvent.importDescription &&
									detailedEvent.importDescription !== description && (
										<section>
											<h3 className="mb-2 text-sm font-semibold">
												Imported notes
											</h3>
											<div className="whitespace-pre-wrap rounded-lg border bg-muted/20 p-4 text-sm leading-6">
												{detailedEvent.importDescription}
											</div>
										</section>
									)}
							</div>
						</ScrollArea>
					</>
				)}
			</SheetContent>
		</Sheet>
	);
}

function DetailMetric({
	icon,
	label,
	value,
}: {
	icon: React.ReactNode;
	label: string;
	value: string;
}) {
	return (
		<div className="rounded-lg border bg-background p-3">
			<div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
				{icon}
				{label}
			</div>
			<p className="break-words text-sm font-medium">{value}</p>
		</div>
	);
}

function CalendarSkeleton() {
	return (
		<div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
			<div className="rounded-xl border bg-card p-4">
				<div className="grid grid-cols-3 gap-3">
					{Array.from({ length: 12 }, (_, index) => (
						<Skeleton key={index} className="h-28" />
					))}
				</div>
			</div>
			<div className="hidden rounded-xl border bg-card p-4 xl:block">
				<Skeleton className="h-6 w-2/3" />
				<div className="mt-4 flex flex-col gap-2">
					<Skeleton className="h-16" />
					<Skeleton className="h-16" />
					<Skeleton className="h-16" />
				</div>
			</div>
		</div>
	);
}

function CalendarError({
	error,
	onRetry,
}: {
	error?: unknown;
	onRetry: () => void;
}) {
	const message =
		import.meta.env.DEV && error instanceof Error ? error.message : null;

	return (
		<div className="rounded-xl border bg-card p-8 text-center">
			<AlertTriangle className="mx-auto h-8 w-8 text-muted-foreground" />
			<h2 className="mt-3 text-lg font-semibold">Calendar could not load</h2>
			<p className="mt-1 text-sm text-muted-foreground">
				The calendar service did not return events. Try again in a moment.
			</p>
			{message && <p className="mt-2 text-xs text-destructive">{message}</p>}
			<Button
				type="button"
				variant="outline"
				className="mt-4"
				onClick={onRetry}
			>
				<RefreshCcw className="mr-2 h-4 w-4" />
				Retry
			</Button>
		</div>
	);
}

function EmptyState({
	icon,
	title,
	description,
}: {
	icon: React.ReactNode;
	title: string;
	description: string;
}) {
	return (
		<div className="flex flex-col items-center justify-center rounded-lg border border-dashed px-4 py-8 text-center">
			<div className="text-muted-foreground">{icon}</div>
			<p className="mt-2 text-sm font-medium">{title}</p>
			<p className="mt-1 max-w-sm text-xs text-muted-foreground">
				{description}
			</p>
		</div>
	);
}

function getFetchStartDate(
	view: CalendarViewSetting,
	anchorDate: Date,
	weekStartsOn: "monday" | "sunday",
	selectedDay: Date,
) {
	if (view === "agenda") return startOfDay(anchorDate);
	if (view === "day") return startOfDay(selectedDay);
	if (view === "week") {
		return startOfWeek(anchorDate, {
			weekStartsOn: weekStartsOn === "sunday" ? 0 : 1,
		});
	}
	return startOfMonth(anchorDate);
}

function getNextPeriodDate(
	view: CalendarViewSetting,
	anchorDate: Date,
	direction: -1 | 1,
) {
	if (view === "month") return addMonths(anchorDate, direction);
	if (view === "week") return addWeeks(anchorDate, direction);
	return addDays(anchorDate, direction);
}

function getPeriodLabel(view: CalendarViewSetting, anchorDate: Date) {
	if (view === "month") return format(anchorDate, "MMMM yyyy");
	if (view === "week") {
		const start = startOfWeek(anchorDate, { weekStartsOn: 1 });
		const end = addDays(start, 6);
		return `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`;
	}
	if (view === "day") return format(anchorDate, "EEEE, MMMM d");
	return `Agenda from ${format(anchorDate, "MMMM d")}`;
}

function formatEventDetails(event: NormalizedCalendarEvent) {
	return [
		event.title,
		event.startsAt
			? `${format(event.startsAt, "PPPP")} · ${formatEventTimeRange(event)}`
			: "Date unknown",
		event.location ? `Location: ${event.location}` : null,
		event.courseTitle ? `Course: ${event.courseTitle}` : null,
		event.description || event.importDescription || null,
	]
		.filter(Boolean)
		.join("\n");
}

function extractSafeLinks(text: string) {
	const matches = text.match(/https?:\/\/[^\s<>"']+/gi) ?? [];
	return Array.from(new Set(matches)).slice(0, 4);
}
