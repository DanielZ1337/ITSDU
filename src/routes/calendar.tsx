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
import { getEventAccent } from "@/lib/calendar/event-colors";
import { formatDate, formatTime, useLocale, useT } from "@/lib/i18n";
import type { TranslationKey } from "@/lib/i18n";
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
	isToday,
	startOfDay,
	startOfMonth,
	startOfWeek,
} from "date-fns";
import { motion } from "framer-motion";
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
import { Link, useSearchParams } from "react-router-dom";
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

const viewLabels: Record<CalendarViewSetting, TranslationKey> = {
	month: "calendar.month",
	week: "calendar.week",
	day: "calendar.day",
	agenda: "calendar.agenda",
};

const pageSize = 80 as const;

export default function CalendarIndex() {
	const t = useT();
	return (
		<>
			<Helmet>
				<title>{t("nav.calendar")}</title>
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
	const [searchParams, setSearchParams] = useSearchParams();

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

	// Deep link support (command palette / notification center): /calendar?eventId=123
	useEffect(() => {
		const requestedEventId = searchParams.get("eventId");
		if (!requestedEventId) return;

		const match = allEvents.find(
			(event) => String(event.numericId) === requestedEventId,
		);
		if (match) {
			setSelectedEvent(match);
			setSelectedDay(startOfDay(match.startsAt ?? new Date()));
		}

		const nextParams = new URLSearchParams(searchParams);
		nextParams.delete("eventId");
		setSearchParams(nextParams, { replace: true });
	}, [allEvents, searchParams, setSearchParams]);

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
				"mx-auto flex h-full min-h-0 w-full max-w-[1600px] flex-col gap-4 p-4 pb-4 sm:p-6 sm:pb-6 lg:p-8 lg:pb-8",
				className,
			)}
		>
			{showHeader && (
				<CalendarHeader
					view={view}
					anchorDate={anchorDate}
					todayCount={todayEvents.length}
					upcomingCount={upcomingCount}
					selectedCount={selectedDayEvents.length}
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
				<div className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
					<section className="flex min-h-0 flex-col overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-border/60 dark:bg-foreground/[0.02]">
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
								onOpenAgenda={() => setPlannerView("agenda")}
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

/* -------------------------------------------------------------------------- */
/* Header + toolbar                                                           */
/* -------------------------------------------------------------------------- */

function CalendarHeader({
	view,
	anchorDate,
	todayCount,
	upcomingCount,
	selectedCount,
	isFetching,
}: {
	view: CalendarViewSetting;
	anchorDate: Date;
	todayCount: number;
	upcomingCount: number;
	selectedCount: number;
	isFetching: boolean;
}) {
	const { locale } = useLocale();
	const t = useT();
	return (
		<header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
			<div className="min-w-0">
				<div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
					<CalendarDays className="h-3.5 w-3.5 text-primary" />
					{t(viewLabels[view])} {t("calendar.planner")}
					{isFetching && (
						<span className="inline-flex items-center gap-1.5 text-primary">
							<span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
							{t("common.loading")}
						</span>
					)}
				</div>
				<h1 className="mt-2 text-[1.75rem] font-semibold leading-tight tracking-tight tabular-nums sm:text-[2rem]">
					{getPeriodLabel(view, anchorDate, locale, t)}
				</h1>
				<p className="mt-1 text-sm text-muted-foreground">
					{t("common.today")} is {formatDate(new Date(), locale)}.
				</p>
			</div>

			<dl className="flex items-stretch self-start divide-x divide-border/60 rounded-xl bg-foreground/[0.03] ring-1 ring-border/50">
				<HeaderStat label={t("common.today")} value={todayCount} />
				<HeaderStat label={t("common.upcoming")} value={upcomingCount} />
				<HeaderStat
					label={t("calendar.control.selected")}
					value={selectedCount}
				/>
			</dl>
		</header>
	);
}

function HeaderStat({ label, value }: { label: string; value: number }) {
	return (
		<div className="flex min-w-[5rem] flex-col px-4 py-2.5">
			<dt className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
				{label}
			</dt>
			<dd className="text-xl font-semibold tabular-nums">{value}</dd>
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
	const { locale } = useLocale();
	const t = useT();
	return (
		<div className="flex flex-col gap-2 rounded-xl bg-foreground/[0.03] p-2 ring-1 ring-border/50">
			<div className="flex flex-wrap items-center gap-2">
				<Button
					type="button"
					variant="ghost"
					size="sm"
					className="h-9 bg-background/70 shadow-sm ring-1 ring-border/60 hover:bg-background"
					onClick={onToday}
				>
					{t("common.today")}
				</Button>
				<div className="flex items-center rounded-lg bg-background/70 p-0.5 shadow-sm ring-1 ring-border/60">
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="h-8 w-8"
						onClick={onPrevious}
					>
						<ArrowLeft className="h-4 w-4" />
						<span className="sr-only">{t("calendar.control.prev")}</span>
					</Button>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="h-8 w-8"
						onClick={onNext}
					>
						<ArrowRight className="h-4 w-4" />
						<span className="sr-only">{t("calendar.control.next")}</span>
					</Button>
				</div>
				<span className="px-1 text-sm font-medium tabular-nums text-muted-foreground">
					{formatDate(anchorDate, locale)}
				</span>

				<div className="ml-auto">
					<ViewSwitcher
						view={view}
						availableViews={availableViews}
						onViewChange={onViewChange}
					/>
				</div>
			</div>

			<div className="flex flex-col gap-2 sm:flex-row">
				<div className="relative min-w-0 flex-1">
					<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						value={search}
						onChange={(event) => onSearchChange(event.target.value)}
						placeholder={t("common.search")}
						className="border-0 bg-background/70 pl-9 shadow-sm ring-1 ring-border/60 focus-visible:ring-1 focus-visible:ring-primary/50"
					/>
				</div>
				<Select value={courseFilter} onValueChange={onCourseFilterChange}>
					<SelectTrigger className="border-0 bg-background/70 shadow-sm ring-1 ring-border/60 sm:w-56">
						<ListFilter className="mr-2 h-4 w-4 text-muted-foreground" />
						<SelectValue placeholder={t("calendar.filterByCourse")} />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">{t("common.allCourses")}</SelectItem>
						{courseOptions.map((course) => (
							<SelectItem key={course.id} value={String(course.id)}>
								{course.title}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
		</div>
	);
}

function ViewSwitcher({
	view,
	availableViews,
	onViewChange,
}: {
	view: CalendarViewSetting;
	availableViews: CalendarViewSetting[];
	onViewChange: (view: CalendarViewSetting) => void;
}) {
	const t = useT();
	return (
		<div className="flex items-center gap-0.5 rounded-lg bg-background/70 p-0.5 shadow-sm ring-1 ring-border/60">
			{availableViews.map((calendarView) => {
				const active = view === calendarView;
				return (
					<button
						key={calendarView}
						type="button"
						onClick={() => onViewChange(calendarView)}
						aria-pressed={active}
						className={cn(
							"relative rounded-md px-3 py-1.5 text-sm font-medium transition-colors motion-reduce:transition-none",
							active
								? "text-primary"
								: "text-muted-foreground hover:text-foreground",
						)}
					>
						{active && (
							<motion.span
								layoutId="calendarViewIndicator"
								transition={{ type: "spring", stiffness: 420, damping: 34 }}
								className="absolute inset-0 rounded-md bg-primary/15 ring-1 ring-inset ring-primary/30"
							/>
						)}
						<span className="relative z-10">{t(viewLabels[calendarView])}</span>
					</button>
				);
			})}
		</div>
	);
}

/* -------------------------------------------------------------------------- */
/* Month view                                                                 */
/* -------------------------------------------------------------------------- */

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
	const days = useMemo(() => weeks.flat(), [weeks]);

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<div
				className="grid shrink-0 border-b border-border/60"
				style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
			>
				{weeks[0]?.map((day) => (
					<div
						key={day.toISOString()}
						className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground"
					>
						{format(day, "EEE")}
					</div>
				))}
			</div>
			<div
				className="grid min-h-0 flex-1 auto-rows-fr overflow-y-auto"
				style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
			>
				{days.map((day) => (
					<MonthCell
						key={day.toISOString()}
						day={day}
						anchorDate={anchorDate}
						selectedDay={selectedDay}
						events={events}
						onSelectDay={onSelectDay}
						onOpenEvent={onOpenEvent}
					/>
				))}
			</div>
		</div>
	);
}

function MonthCell({
	day,
	anchorDate,
	selectedDay,
	events,
	onSelectDay,
	onOpenEvent,
}: {
	day: Date;
	anchorDate: Date;
	selectedDay: Date;
	events: NormalizedCalendarEvent[];
	onSelectDay: (date: Date) => void;
	onOpenEvent: (event: NormalizedCalendarEvent) => void;
}) {
	const dayEvents = getDateEvents(events, day);
	const visible = dayEvents.slice(0, 3);
	const more = dayEvents.length - visible.length;
	const today = isToday(day);
	const selected = isSameDay(day, selectedDay);
	const currentMonth = isSameMonth(day, anchorDate);

	return (
		<div
			role="button"
			tabIndex={0}
			onClick={() => onSelectDay(startOfDay(day))}
			onKeyDown={(keyboardEvent) => {
				if (keyboardEvent.key === "Enter" || keyboardEvent.key === " ") {
					keyboardEvent.preventDefault();
					onSelectDay(startOfDay(day));
				}
			}}
			className={cn(
				"relative flex min-h-[112px] min-w-0 flex-col gap-1 border-b border-r border-border/40 p-1.5 text-left outline-none transition-colors motion-reduce:transition-none",
				"hover:bg-foreground/[0.03] focus-visible:bg-foreground/[0.05]",
				!currentMonth && "bg-foreground/[0.015]",
				today &&
					"bg-gradient-to-br from-primary/[0.12] via-primary/[0.04] to-transparent",
				selected && "ring-1 ring-inset ring-primary/50",
			)}
		>
			<div className="flex items-center justify-between px-0.5">
				<span
					className={cn(
						"flex h-6 min-w-6 items-center justify-center rounded-full px-1 text-[13px] font-semibold tabular-nums",
						today
							? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
							: currentMonth
								? "text-foreground"
								: "text-muted-foreground/60",
					)}
				>
					{format(day, "d")}
				</span>
				{dayEvents.length > 0 && (
					<span className="text-[11px] font-medium tabular-nums text-muted-foreground">
						{dayEvents.length}
					</span>
				)}
			</div>
			<div className="flex min-h-0 flex-col gap-0.5">
				{visible.map((event) => (
					<MonthChip
						key={event.id}
						event={event}
						onOpen={() => onOpenEvent(event)}
					/>
				))}
				{more > 0 && (
					<button
						type="button"
						onClick={(clickEvent) => {
							clickEvent.stopPropagation();
							onSelectDay(startOfDay(day));
						}}
						className="mt-0.5 rounded-md px-1.5 py-0.5 text-left text-[11px] font-medium text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground motion-reduce:transition-none"
					>
						+{more} more
					</button>
				)}
			</div>
		</div>
	);
}

function MonthChip({
	event,
	onOpen,
}: {
	event: NormalizedCalendarEvent;
	onOpen: () => void;
}) {
	const accent = getEventAccent(event.courseId);
	const past = event.isPast;

	return (
		<button
			type="button"
			onClick={(clickEvent) => {
				clickEvent.stopPropagation();
				onOpen();
			}}
			className={cn(
				"group flex w-full items-center gap-1.5 rounded-md py-[3px] pl-1 pr-1.5 text-left transition-colors motion-reduce:transition-none",
				past ? "hover:bg-foreground/[0.06]" : accent.chipBg,
			)}
		>
			<span
				className={cn(
					"h-3 w-[3px] shrink-0 rounded-full",
					past ? "bg-muted-foreground/40" : accent.dot,
				)}
			/>
			<span
				className={cn(
					"truncate text-[12px] leading-tight",
					past ? "text-muted-foreground" : accent.chipText,
				)}
			>
				{event.isTimed && event.startsAt && (
					<span className="mr-1 tabular-nums opacity-70">
						{format(event.startsAt, "HH:mm")}
					</span>
				)}
				{event.title}
			</span>
		</button>
	);
}

/* -------------------------------------------------------------------------- */
/* Week view                                                                  */
/* -------------------------------------------------------------------------- */

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
	const t = useT();
	const days = useMemo(
		() => getWeekDays(anchorDate, weekStartsOn, showWeekends),
		[anchorDate, showWeekends, weekStartsOn],
	);
	const now = new Date();

	return (
		<div className="min-h-0 flex-1 overflow-auto">
			<div
				className="grid min-h-full min-w-[760px]"
				style={{
					gridTemplateColumns: `repeat(${days.length}, minmax(150px, 1fr))`,
				}}
			>
				{days.map((day) => {
					const dayEvents = [...getDateEvents(events, day)].sort(byStartTime);
					const today = isToday(day);
					const selected = isSameDay(day, selectedDay);
					return (
						<div
							key={day.toISOString()}
							className={cn(
								"flex min-h-0 flex-col border-r border-border/40 last:border-r-0",
								today && "bg-primary/[0.03]",
							)}
						>
							<button
								type="button"
								onClick={() => onSelectDay(startOfDay(day))}
								className={cn(
									"sticky top-0 z-10 flex items-center justify-between gap-2 border-b border-border/50 bg-card/90 px-3 py-2.5 text-left backdrop-blur transition-colors dark:bg-background/80",
									selected && "bg-primary/[0.06] dark:bg-primary/[0.08]",
								)}
							>
								<div className="flex items-baseline gap-2">
									<span
										className={cn(
											"text-xs font-semibold uppercase tracking-wide",
											today ? "text-primary" : "text-muted-foreground",
										)}
									>
										{format(day, "EEE")}
									</span>
									<span
										className={cn(
											"flex h-6 min-w-6 items-center justify-center rounded-full px-1 text-sm font-semibold tabular-nums",
											today
												? "bg-primary text-primary-foreground"
												: "text-foreground",
										)}
									>
										{format(day, "d")}
									</span>
								</div>
								{today ? (
									<span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-primary">
										{t("calendar.now")} {format(now, "HH:mm")}
									</span>
								) : (
									dayEvents.length > 0 && (
										<span className="text-xs tabular-nums text-muted-foreground">
											{dayEvents.length}
										</span>
									)
								)}
							</button>
							<div className="flex flex-1 flex-col gap-1.5 p-2">
								{dayEvents.length === 0 ? (
									<p className="mt-6 text-center text-xs text-muted-foreground/50">
										{t("calendar.free")}
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

function WeekEventBlock({
	event,
	onClick,
}: {
	event: NormalizedCalendarEvent;
	onClick: () => void;
}) {
	const { locale } = useLocale();
	const accent = getEventAccent(event.courseId);
	const past = event.isPast;

	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"group flex w-full items-stretch gap-2 overflow-hidden rounded-lg p-2 text-left transition-all duration-150 hover:-translate-y-px hover:shadow-sm motion-reduce:transition-none motion-reduce:hover:translate-y-0",
				past ? "bg-foreground/[0.03] opacity-70" : accent.soft,
			)}
		>
			<span
				className={cn(
					"w-[3px] shrink-0 rounded-full",
					past ? "bg-muted-foreground/40" : accent.dot,
				)}
			/>
			<div className="min-w-0">
				<p className="truncate text-[13px] font-semibold leading-tight">
					{event.title}
				</p>
				<p className="mt-1 flex items-center gap-1 text-[11px] tabular-nums text-muted-foreground">
					<Clock className="h-3 w-3 shrink-0" />
					{formatEventTimeRange(event, locale)}
				</p>
				{event.location && (
					<p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
						<MapPin className="h-3 w-3 shrink-0" />
						<span className="truncate">{event.location}</span>
					</p>
				)}
			</div>
		</button>
	);
}

/* -------------------------------------------------------------------------- */
/* Day view (timeline)                                                        */
/* -------------------------------------------------------------------------- */

function DayView({
	date,
	events,
	onOpenEvent,
	onOpenAgenda,
}: {
	date: Date;
	events: NormalizedCalendarEvent[];
	onOpenEvent: (event: NormalizedCalendarEvent) => void;
	onOpenAgenda: () => void;
}) {
	const t = useT();
	const sorted = useMemo(() => [...events].sort(byStartTime), [events]);

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<header className="shrink-0 border-b border-border/60 bg-gradient-to-b from-foreground/[0.03] to-transparent px-5 py-4">
				<p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
					{format(date, "EEEE")}
				</p>
				<h2 className="mt-0.5 text-2xl font-semibold tracking-tight tabular-nums">
					{format(date, "MMMM d, yyyy")}
				</h2>
				<p className="mt-1 text-sm text-muted-foreground">
					{events.length === 0
						? t("calendar.emptyDay")
						: `${events.length} ${t("calendar.control.selected")}`}
				</p>
			</header>
			<div className="min-h-0 flex-1 overflow-y-auto p-5">
				{sorted.length === 0 ? (
					<EmptyState
						icon={<CalendarDays className="h-5 w-5" />}
						title={t("calendar.emptyDay")}
						description={t("overview.empty.calendar")}
						action={
							<Button
								type="button"
								variant="secondary"
								size="sm"
								onClick={onOpenAgenda}
							>
								{t("calendar.agenda")}
							</Button>
						}
					/>
				) : (
					<ol className="relative ml-1 flex flex-col gap-1 border-l border-border/60 pl-6">
						{sorted.map((event) => (
							<DayTimelineRow
								key={event.id}
								event={event}
								onClick={() => onOpenEvent(event)}
							/>
						))}
					</ol>
				)}
			</div>
		</div>
	);
}

function DayTimelineRow({
	event,
	onClick,
}: {
	event: NormalizedCalendarEvent;
	onClick: () => void;
}) {
	const { locale } = useLocale();
	const accent = getEventAccent(event.courseId);
	const past = event.isPast;

	return (
		<li className="relative">
			<span
				className={cn(
					"absolute -left-[27px] top-4 h-2.5 w-2.5 rounded-full ring-4 ring-card dark:ring-background",
					past ? "bg-muted-foreground/50" : accent.dot,
				)}
			/>
			<button
				type="button"
				onClick={onClick}
				className={cn(
					"group flex w-full gap-3 rounded-xl p-2 text-left transition-colors hover:bg-foreground/[0.04] motion-reduce:transition-none",
					past && "opacity-70",
				)}
			>
				<div className="w-12 shrink-0 pt-2 text-right">
					<p className="text-sm font-semibold tabular-nums">
						{event.startsAt ? formatTime(event.startsAt, locale) : "--:--"}
					</p>
					{event.durationMinutes ? (
						<p className="text-[11px] tabular-nums text-muted-foreground">
							{formatDuration(event.durationMinutes)}
						</p>
					) : null}
				</div>
				<div className={cn("min-w-0 flex-1 rounded-lg p-3", accent.soft)}>
					<p className="truncate text-sm font-semibold">{event.title}</p>
					<div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
						<span className="inline-flex items-center gap-1 tabular-nums">
							<Clock className="h-3 w-3" />
							{formatEventTimeRange(event, locale)}
						</span>
						{event.location && (
							<span className="inline-flex min-w-0 items-center gap-1">
								<MapPin className="h-3 w-3 shrink-0" />
								<span className="truncate">{event.location}</span>
							</span>
						)}
						{event.courseTitle && (
							<span
								className={cn(
									"inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[11px] font-medium",
									accent.chipBg,
									accent.chipText,
								)}
							>
								<GraduationCap className="h-3 w-3" />
								{event.courseTitle}
							</span>
						)}
					</div>
				</div>
			</button>
		</li>
	);
}

/* -------------------------------------------------------------------------- */
/* Agenda view                                                                */
/* -------------------------------------------------------------------------- */

function AgendaView({
	events,
	onOpenEvent,
}: {
	events: NormalizedCalendarEvent[];
	onOpenEvent: (event: NormalizedCalendarEvent) => void;
}) {
	const t = useT();
	const groups = useMemo(() => groupAgendaEvents(events), [events]);

	if (groups.length === 0) {
		return (
			<div className="flex min-h-0 flex-1 items-center justify-center p-6">
				<EmptyState
					icon={<CalendarDays className="h-5 w-5" />}
					title={t("calendar.empty")}
					description={t("overview.empty.calendar")}
				/>
			</div>
		);
	}

	return (
		<div className="min-h-0 flex-1 overflow-y-auto">
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
	const t = useT();
	return (
		<section>
			<div className="sticky top-0 z-10 flex items-center gap-3 border-b border-border/50 bg-card/90 px-5 py-2.5 backdrop-blur dark:bg-background/80">
				<h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground">
					{agendaGroupLabel(group.key, t)}
				</h3>
				<span className="h-px flex-1 bg-border/60" />
				<span className="text-xs tabular-nums text-muted-foreground">
					{group.items.length}
				</span>
			</div>
			<ul className="divide-y divide-border/40">
				{group.items.map((event) => (
					<li key={event.id}>
						<AgendaRow event={event} onClick={() => onOpenEvent(event)} />
					</li>
				))}
			</ul>
		</section>
	);
}

function AgendaRow({
	event,
	onClick,
}: {
	event: NormalizedCalendarEvent;
	onClick: () => void;
}) {
	const { locale } = useLocale();
	const t = useT();
	const accent = getEventAccent(event.courseId);
	const past = event.isPast;
	const context = event.location || event.courseTitle;

	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"group flex w-full items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-foreground/[0.03] motion-reduce:transition-none",
				past && "opacity-60",
			)}
		>
			<span
				className={cn(
					"h-9 w-1 shrink-0 rounded-full",
					past ? "bg-muted-foreground/40" : accent.dot,
				)}
			/>
			<div className="flex w-12 shrink-0 flex-col items-center">
				<span className="text-[11px] font-medium uppercase text-muted-foreground">
					{event.startsAt ? format(event.startsAt, "EEE") : "--"}
				</span>
				<span className="text-lg font-semibold leading-none tabular-nums">
					{event.startsAt ? format(event.startsAt, "d") : "?"}
				</span>
			</div>
			<div className="min-w-0 flex-1">
				<p className="truncate text-sm font-semibold">{event.title}</p>
				<div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
					<span className="inline-flex items-center gap-1 tabular-nums">
						<Clock className="h-3 w-3" />
						{formatEventTimeRange(event, locale)}
					</span>
					{context && (
						<span className="inline-flex min-w-0 items-center gap-1">
							<MapPin className="h-3 w-3 shrink-0" />
							<span className="truncate">{context}</span>
						</span>
					)}
				</div>
			</div>
			{event.isToday && (
				<span className="shrink-0 rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-semibold text-primary">
					{t("common.today")}
				</span>
			)}
		</button>
	);
}

/* -------------------------------------------------------------------------- */
/* Selected-day rail                                                          */
/* -------------------------------------------------------------------------- */

function DaySidePanel({
	date,
	events,
	onOpenEvent,
}: {
	date: Date;
	events: NormalizedCalendarEvent[];
	onOpenEvent: (event: NormalizedCalendarEvent) => void;
}) {
	const t = useT();
	return (
		<aside className="hidden min-h-0 flex-col overflow-hidden rounded-2xl bg-muted/30 ring-1 ring-border/60 dark:bg-foreground/[0.03] xl:flex">
			<header className="shrink-0 border-b border-border/50 bg-gradient-to-b from-foreground/[0.04] to-transparent px-4 py-4">
				<p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
					{format(date, "EEEE")}
				</p>
				<div className="mt-0.5 flex items-baseline gap-2">
					<span className="text-3xl font-semibold tabular-nums">
						{format(date, "d")}
					</span>
					<span className="text-sm font-medium text-muted-foreground">
						{format(date, "MMMM yyyy")}
					</span>
				</div>
				<p className="mt-1 text-xs text-muted-foreground">
					{events.length === 0
						? t("calendar.emptyDay")
						: events.length === 1
							? t("calendar.day.eventCountOne")
							: t("calendar.day.eventCountMany", { count: events.length })}
				</p>
			</header>
			<div className="min-h-0 flex-1 overflow-y-auto p-2">
				{events.length === 0 ? (
					<EmptyState
						icon={<CalendarDays className="h-5 w-5" />}
						title={t("calendar.emptyDay")}
						description={t("overview.empty.calendar")}
					/>
				) : (
					<ul className="flex flex-col gap-1">
						{events.map((event) => (
							<li key={event.id}>
								<RailRow event={event} onClick={() => onOpenEvent(event)} />
							</li>
						))}
					</ul>
				)}
			</div>
		</aside>
	);
}

function RailRow({
	event,
	onClick,
}: {
	event: NormalizedCalendarEvent;
	onClick: () => void;
}) {
	const accent = getEventAccent(event.courseId);
	const past = event.isPast;

	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"group flex w-full items-stretch gap-2.5 rounded-xl p-2.5 text-left transition-colors hover:bg-foreground/[0.05] motion-reduce:transition-none",
				past && "opacity-60",
			)}
		>
			<span
				className={cn(
					"w-1 shrink-0 rounded-full",
					past ? "bg-muted-foreground/40" : accent.dot,
				)}
			/>
			<div className="min-w-0 flex-1">
				<p className="truncate text-sm font-medium">{event.title}</p>
				<p className="mt-0.5 flex items-center gap-1 text-xs tabular-nums text-muted-foreground">
					<Clock className="h-3 w-3 shrink-0" />
					{formatEventTimeRange(event, locale)}
				</p>
				{event.location && (
					<p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
						<MapPin className="h-3 w-3 shrink-0" />
						<span className="truncate">{event.location}</span>
					</p>
				)}
			</div>
		</button>
	);
}

/* -------------------------------------------------------------------------- */
/* Event detail drawer                                                        */
/* -------------------------------------------------------------------------- */

function EventDetailDrawer({
	event,
	onClose,
}: {
	event: NormalizedCalendarEvent | null;
	onClose: () => void;
}) {
	const { locale } = useLocale();
	const t = useT();
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
		await navigator.clipboard.writeText(
			formatEventDetails(detailedEvent, locale, t),
		);
		toast.success(t("common.copyDetails"));
	};

	const accent = getEventAccent(detailedEvent?.courseId);
	const description =
		detailedEvent?.description || detailedEvent?.importDescription || "";
	const descriptionLinks = extractSafeLinks(description);
	const duration = formatDuration(detailedEvent?.durationMinutes ?? null);
	const dateUnknown = t("calendar.detail.dateUnknown");
	const notSpecified = t("calendar.detail.notSpecified");
	const noLocation = t("calendar.detail.noLocation");
	const noCourse = t("calendar.detail.noCourseLinked");
	const noDescription = t("calendar.detail.noDescription");

	return (
		<Sheet open={Boolean(event)} onOpenChange={(open) => !open && onClose()}>
			<SheetContent
				side="right"
				className="bottom-4 right-4 top-4 flex h-auto w-[min(560px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border-0 p-0 shadow-2xl ring-1 ring-border/60 sm:max-w-none"
			>
				{detailedEvent && (
					<>
						<SheetHeader className="relative shrink-0 space-y-0 overflow-hidden border-b border-border/60 px-5 pb-4 pt-5 text-left">
							<div
								className={cn(
									"pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b to-transparent",
									accent.gradient,
								)}
							/>
							<div className="relative flex flex-col gap-2 pr-10">
								{detailedEvent.courseTitle && (
									<span
										className={cn(
											"inline-flex w-fit items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium",
											accent.chipBg,
											accent.chipText,
										)}
									>
										<GraduationCap className="h-3 w-3" />
										{detailedEvent.courseTitle}
									</span>
								)}
								<SheetTitle className="text-xl leading-snug">
									{detailedEvent.title}
								</SheetTitle>
								<SheetDescription className="flex items-center gap-1.5 tabular-nums">
									<CalendarDays className="h-3.5 w-3.5 shrink-0" />
									{detailedEvent.startsAt
										? formatDate(detailedEvent.startsAt, locale)
										: dateUnknown}
								</SheetDescription>
							</div>
						</SheetHeader>

						<ScrollArea className="min-h-0 flex-1">
							<div className="flex flex-col gap-5 p-5 pb-8">
								<div className="grid grid-cols-2 overflow-hidden rounded-xl bg-foreground/[0.03] ring-1 ring-border/50">
									<DetailFact
										icon={<Clock className="h-3.5 w-3.5" />}
										label={t("calendar.detail.time")}
										value={formatEventTimeRange(detailedEvent, locale)}
										className="border-b border-r border-border/40"
									/>
									<DetailFact
										icon={<CalendarDays className="h-3.5 w-3.5" />}
										label={t("calendar.detail.duration")}
										value={duration ?? notSpecified}
										className="border-b border-border/40"
									/>
									<DetailFact
										icon={<MapPin className="h-3.5 w-3.5" />}
										label={t("calendar.detail.location")}
										value={detailedEvent.location ?? noLocation}
										className="border-r border-border/40"
									/>
									<DetailFact
										icon={<GraduationCap className="h-3.5 w-3.5" />}
										label={t("calendar.detail.course")}
										value={detailedEvent.courseTitle ?? noCourse}
									/>
								</div>

								<div className="flex flex-wrap gap-2">
									<Button
										type="button"
										variant="secondary"
										size="sm"
										onClick={() => void copyDetails()}
									>
										<Copy className="mr-2 h-3.5 w-3.5" />
										{t("calendar.detail.copyDetails")}
									</Button>
									{detailedEvent.courseId && (
										<Button asChild type="button" variant="outline" size="sm">
											<Link to={`/courses/${detailedEvent.courseId}`}>
												<GraduationCap className="mr-2 h-3.5 w-3.5" />
												{t("calendar.detail.openCourse")}
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
											{t("calendar.detail.openExternally")}
										</Button>
									)}
								</div>

								{detailQuery.isError && (
									<div className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive ring-1 ring-destructive/20">
										{locale === "da"
											? "Fuldstændige detaljer kunne ikke indlæses, men oversigten ovenfor er opdateret."
											: "Full details couldn't load, but the summary above is up to date."}
									</div>
								)}

								<section>
									<h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
										{t("calendar.detail.description")}
									</h3>
									{description ? (
										<div className="whitespace-pre-wrap rounded-xl bg-foreground/[0.03] p-4 text-sm leading-6 ring-1 ring-border/40">
											{description}
										</div>
									) : (
										<p className="rounded-xl bg-foreground/[0.02] p-4 text-sm text-muted-foreground ring-1 ring-border/40">
											{noDescription}
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
													{t("common.open")}
												</Button>
											))}
										</div>
									)}
								</section>

								{detailedEvent.importDescription &&
									detailedEvent.importDescription !== description && (
										<section>
											<h3 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">
												<span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
												{t("calendar.detail.importedNotes")}
											</h3>
											<div className="whitespace-pre-wrap rounded-xl bg-amber-500/5 p-4 text-sm leading-6 ring-1 ring-amber-500/20">
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

function DetailFact({
	icon,
	label,
	value,
	className,
}: {
	icon: React.ReactNode;
	label: string;
	value: string;
	className?: string;
}) {
	return (
		<div className={cn("flex flex-col gap-1 p-3.5", className)}>
			<span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
				{icon}
				{label}
			</span>
			<span className="break-words text-sm font-medium">{value}</span>
		</div>
	);
}

/* -------------------------------------------------------------------------- */
/* States                                                                     */
/* -------------------------------------------------------------------------- */

function CalendarSkeleton() {
	return (
		<div className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
			<div className="overflow-hidden rounded-2xl ring-1 ring-border/60 dark:bg-foreground/[0.02]">
				<div className="grid grid-cols-7 gap-px bg-border/30 p-px">
					{Array.from({ length: 35 }, (_, index) => (
						<div
							key={index}
							className="min-h-[96px] bg-card p-2 dark:bg-background"
						>
							<Skeleton className="h-5 w-5 rounded-full" />
							<Skeleton className="mt-2 h-3 w-4/5 rounded" />
							<Skeleton className="mt-1 h-3 w-3/5 rounded" />
						</div>
					))}
				</div>
			</div>
			<div className="hidden rounded-2xl p-4 ring-1 ring-border/60 dark:bg-foreground/[0.03] xl:block">
				<Skeleton className="h-8 w-2/3 rounded" />
				<div className="mt-4 flex flex-col gap-2">
					<Skeleton className="h-14 rounded-lg" />
					<Skeleton className="h-14 rounded-lg" />
					<Skeleton className="h-14 rounded-lg" />
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
	const t = useT();
	const message =
		import.meta.env.DEV && error instanceof Error ? error.message : null;

	return (
		<div className="flex min-h-0 flex-1 flex-col items-center justify-center rounded-2xl p-10 text-center ring-1 ring-border/60 dark:bg-foreground/[0.02]">
			<div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
				<AlertTriangle className="h-6 w-6" />
			</div>
			<h2 className="mt-4 text-lg font-semibold">{t("errors.generic")}</h2>
			<p className="mt-1 max-w-sm text-sm text-muted-foreground">
				{t("errors.generic")}
			</p>
			{message && <p className="mt-2 text-xs text-destructive">{message}</p>}
			<Button
				type="button"
				variant="secondary"
				className="mt-5"
				onClick={onRetry}
			>
				<RefreshCcw className="mr-2 h-4 w-4" />
				{t("common.retry")}
			</Button>
		</div>
	);
}

function EmptyState({
	icon,
	title,
	description,
	action,
}: {
	icon: React.ReactNode;
	title: string;
	description: string;
	action?: React.ReactNode;
}) {
	return (
		<div className="flex flex-col items-center justify-center px-6 py-12 text-center">
			<div className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground/[0.06] text-muted-foreground">
				{icon}
			</div>
			<p className="mt-4 text-sm font-semibold">{title}</p>
			<p className="mt-1 max-w-xs text-xs text-muted-foreground">
				{description}
			</p>
			{action && <div className="mt-4">{action}</div>}
		</div>
	);
}

/* -------------------------------------------------------------------------- */
/* Helpers (unchanged logic)                                                  */
/* -------------------------------------------------------------------------- */

function byStartTime(a: NormalizedCalendarEvent, b: NormalizedCalendarEvent) {
	const aTime = a.startsAt ? a.startsAt.getTime() : Number.POSITIVE_INFINITY;
	const bTime = b.startsAt ? b.startsAt.getTime() : Number.POSITIVE_INFINITY;
	return aTime - bTime;
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

function getPeriodLabel(
	view: CalendarViewSetting,
	anchorDate: Date,
	locale: "en" | "da",
	t: ReturnType<typeof useT>,
) {
	if (view === "month") return formatDate(anchorDate, locale);
	if (view === "week") {
		const start = startOfWeek(anchorDate, { weekStartsOn: 1 });
		const end = addDays(start, 6);
		return `${formatDate(start, locale)} - ${formatDate(end, locale)}`;
	}
	if (view === "day") return formatDate(anchorDate, locale);
	return `${t("calendar.agenda")} ${formatDate(anchorDate, locale)}`;
}

function formatEventDetails(
	event: NormalizedCalendarEvent,
	locale: "en" | "da",
	t: ReturnType<typeof useT>,
) {
	return [
		event.title,
		event.startsAt
			? `${formatDate(event.startsAt, locale)} · ${formatEventTimeRange(event, locale)}`
			: t("calendar.detail.dateUnknown"),
		event.location
			? `${t("calendar.detail.location")}: ${event.location}`
			: null,
		event.courseTitle
			? `${t("calendar.detail.course")}: ${event.courseTitle}`
			: null,
		event.description || event.importDescription || null,
	]
		.filter(Boolean)
		.join("\n");
}

function extractSafeLinks(text: string) {
	const matches = text.match(/https?:\/\/[^\s<>"']+/gi) ?? [];
	return Array.from(new Set(matches)).slice(0, 4);
}

function agendaGroupLabel(
	key: CalendarAgendaGroup["key"],
	t: ReturnType<typeof useT>,
) {
	switch (key) {
		case "today":
			return t("calendar.group.today");
		case "tomorrow":
			return t("calendar.group.tomorrow");
		case "thisWeek":
			return t("calendar.group.thisWeek");
		case "later":
			return t("calendar.group.later");
		default:
			return t("calendar.group.noDate");
	}
}
