import { ResourceTypeBadge } from "@/components/resources/resource-type-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useShowSettingsModal } from "@/hooks/atoms/useSettingsModal";
import {
	type CachedResourceSummary,
	useCachedResources,
} from "@/hooks/useCachedResources";
import {
	type NormalizedCalendarEvent,
	formatEventTimeRange,
	groupAgendaEvents,
	normalizeCalendarEvents,
} from "@/lib/calendar/calendar-events";
import {
	formatSize,
	getResourceOpenRoute,
} from "@/lib/resources/resource-format";
import { cn } from "@/lib/utils";
import useGETcalendarEvents from "@/queries/calendar/useGETcalendarEvents";
import useGETcourses from "@/queries/course-cards/useGETcourses";
import useGETinstantMessagesv2 from "@/queries/messages/useGETinstantMessagesv2";
import useGETpersonalTasks from "@/queries/tasks/useGETpersonalTasks";
import type { ItslearningRestApiEntitiesCourseCard } from "@/types/api-types/utils/Itslearning.RestApi.Entities.CourseCard";
import type { ItslearningRestApiEntitiesInstantMessageThread } from "@/types/api-types/utils/Itslearning.RestApi.Entities.InstantMessageThread";
import type { ItslearningRestApiEntitiesTask } from "@/types/api-types/utils/Itslearning.RestApi.Entities.Task";
import { ItslearningRestApiEntitiesTaskDeadlineFilter } from "@/types/api-types/utils/Itslearning.RestApi.Entities.TaskDeadlineFilter";
import { ItslearningRestApiEntitiesTaskStatusFilter } from "@/types/api-types/utils/Itslearning.RestApi.Entities.TaskStatusFilter";
import {
	AlertTriangle,
	ArrowRight,
	CalendarDays,
	CheckSquare,
	File as FileIcon,
	GraduationCap,
	Inbox,
	MessageSquare,
	RefreshCcw,
	Settings,
	Star,
} from "lucide-react";
import type React from "react";
import { useMemo } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Link } from "react-router-dom";

type TaskUrgency = "overdue" | "today" | "upcoming" | "none";

type DashboardTask = ItslearningRestApiEntitiesTask & {
	deadline: Date | null;
	urgency: TaskUrgency;
};

type DashboardThread = ItslearningRestApiEntitiesInstantMessageThread & {
	unread: boolean;
};

export default function Overview() {
	const today = useMemo(() => new Date(), []);

	const calendarQuery = useGETcalendarEvents(
		{ fromDate: today, page: 0, pageSize: 16 },
		{ keepPreviousData: true, staleTime: 1000 * 60 * 5 },
	);
	const tasksQuery = useGETpersonalTasks(
		{
			PageIndex: 0,
			PageSize: 20,
			status: ItslearningRestApiEntitiesTaskStatusFilter.Active,
			deadline: ItslearningRestApiEntitiesTaskDeadlineFilter.All,
		},
		{ keepPreviousData: true, staleTime: 1000 * 60 * 5 },
	);
	const messagesQuery = useGETinstantMessagesv2(
		{ maxThreadCount: 8, threadPage: 0, maxMessages: 1 },
		{ staleTime: 1000 * 60 * 2 },
	);
	const coursesQuery = useGETcourses(
		"Starred",
		{ PageIndex: 0, PageSize: 8, sortBy: "LastOnline", isShowMore: false },
		{ suspense: false, staleTime: 1000 * 60 * 10 },
	);
	const recent = useCachedResources({ limit: 8 });

	// --- Tasks: dedupe obvious repeats, classify urgency, sort by due date ---
	const tasks = useMemo<DashboardTask[]>(() => {
		const raw = tasksQuery.data?.EntityArray ?? [];
		const seen = new Set<string>();
		const result: DashboardTask[] = [];

		for (const task of raw) {
			const deadline = parseDeadline(task.Deadline);
			const key = `${task.Title}__${task.LocationTitle}__${
				deadline ? deadline.toDateString() : "none"
			}`;
			if (seen.has(key)) continue;
			seen.add(key);
			result.push({ ...task, deadline, urgency: classifyUrgency(deadline) });
		}

		return result.sort((a, b) => {
			if (a.deadline && b.deadline)
				return a.deadline.getTime() - b.deadline.getTime();
			if (a.deadline) return -1;
			if (b.deadline) return 1;
			return 0;
		});
	}, [tasksQuery.data]);

	// --- Calendar: only future-relevant events, grouped by today/tomorrow/later ---
	const eventGroups = useMemo(() => {
		const now = new Date();
		const events = normalizeCalendarEvents(
			calendarQuery.data?.EntityArray ?? [],
		)
			.filter((event) => !event.endsAt || event.endsAt >= now)
			.slice(0, 8);

		return groupAgendaEvents(events, now);
	}, [calendarQuery.data]);

	// --- Messages: unread first ---
	const threads = useMemo<DashboardThread[]>(() => {
		const all =
			messagesQuery.data?.pages.flatMap((page) => page.EntityArray) ?? [];
		return all
			.map((thread) => ({
				...thread,
				unread: thread.LastMessage
					? thread.LastMessage.MessageId !== thread.LastReadInstantMessageId
					: false,
			}))
			.sort((a, b) => Number(b.unread) - Number(a.unread));
	}, [messagesQuery.data]);

	const courses = coursesQuery.data?.EntityArray ?? [];

	const overdueCount = tasks.filter(
		(task) => task.urgency === "overdue",
	).length;
	const dueTodayCount = tasks.filter((task) => task.urgency === "today").length;
	const eventsTodayCount =
		eventGroups.find((group) => group.key === "today")?.items.length ?? 0;
	const unreadCount = threads.filter((thread) => thread.unread).length;

	return (
		<div className="mx-auto flex w-full max-w-7xl flex-col gap-4 p-4 pb-12 sm:gap-5 sm:p-6 lg:p-8">
			<Hero
				overdue={overdueCount}
				dueToday={dueTodayCount}
				eventsToday={eventsTodayCount}
				unread={unreadCount}
			/>

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
				<div className="flex flex-col gap-4 lg:col-span-2">
					<WidgetBoundary>
						<TasksWidget tasks={tasks} query={tasksQuery} />
					</WidgetBoundary>
					<WidgetBoundary>
						<CalendarWidget groups={eventGroups} query={calendarQuery} />
					</WidgetBoundary>
				</div>

				<div className="flex flex-col gap-4">
					<WidgetBoundary>
						<MessagesWidget threads={threads} query={messagesQuery} />
					</WidgetBoundary>
					<WidgetBoundary>
						<ContinueWidget resources={recent.resources} />
					</WidgetBoundary>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				<WidgetBoundary>
					<PinnedCoursesWidget courses={courses} query={coursesQuery} />
				</WidgetBoundary>
				<WidgetBoundary>
					<RecentResourcesWidget recent={recent} />
				</WidgetBoundary>
			</div>
		</div>
	);
}

/* -------------------------------------------------------------------------- */
/* Hero                                                                       */
/* -------------------------------------------------------------------------- */

function Hero({
	overdue,
	dueToday,
	eventsToday,
	unread,
}: {
	overdue: number;
	dueToday: number;
	eventsToday: number;
	unread: number;
}) {
	const { toggleSettingsModal } = useShowSettingsModal();
	const now = new Date();
	const hour = now.getHours();
	const greeting =
		hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
	const dateLabel = new Intl.DateTimeFormat(undefined, {
		weekday: "long",
		month: "long",
		day: "numeric",
	}).format(now);

	const stats = [
		overdue > 0 && {
			icon: <AlertTriangle className="h-3.5 w-3.5" />,
			label: `${overdue} overdue`,
			className: "border-destructive/40 text-destructive",
		},
		dueToday > 0 && {
			icon: <CheckSquare className="h-3.5 w-3.5" />,
			label: `${dueToday} due today`,
			className: "border-amber-500/40 text-amber-600 dark:text-amber-400",
		},
		eventsToday > 0 && {
			icon: <CalendarDays className="h-3.5 w-3.5" />,
			label: `${eventsToday} event${eventsToday === 1 ? "" : "s"} today`,
			className: "",
		},
		unread > 0 && {
			icon: <MessageSquare className="h-3.5 w-3.5" />,
			label: `${unread} unread`,
			className: "",
		},
	].filter(Boolean) as {
		icon: React.ReactNode;
		label: string;
		className: string;
	}[];

	return (
		<header className="flex flex-col gap-4 rounded-xl border bg-card p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
			<div className="min-w-0">
				<p className="text-sm text-muted-foreground">{dateLabel}</p>
				<h1 className="mt-0.5 text-2xl font-semibold tracking-tight sm:text-3xl">
					{greeting}
				</h1>
				{stats.length > 0 ? (
					<div className="mt-3 flex flex-wrap gap-2">
						{stats.map((stat) => (
							<Badge
								key={stat.label}
								variant="outline"
								className={cn("gap-1.5 font-normal", stat.className)}
							>
								{stat.icon}
								{stat.label}
							</Badge>
						))}
					</div>
				) : (
					<p className="mt-2 text-sm text-muted-foreground">
						You're all caught up — nothing urgent right now.
					</p>
				)}
			</div>

			<div className="flex flex-wrap items-center gap-2">
				<Button asChild size="sm">
					<Link to="/courses">
						<GraduationCap className="mr-2 h-3.5 w-3.5" />
						Courses
					</Link>
				</Button>
				<Button asChild variant="outline" size="sm">
					<Link to="/calendar">
						<CalendarDays className="mr-2 h-3.5 w-3.5" />
						Calendar
					</Link>
				</Button>
				<Button asChild variant="outline" size="sm">
					<Link to="/messages">
						<MessageSquare className="mr-2 h-3.5 w-3.5" />
						Messages
					</Link>
				</Button>
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={toggleSettingsModal}
				>
					<Settings className="mr-2 h-3.5 w-3.5" />
					Settings
				</Button>
			</div>
		</header>
	);
}

/* -------------------------------------------------------------------------- */
/* Tasks                                                                      */
/* -------------------------------------------------------------------------- */

function TasksWidget({
	tasks,
	query,
}: {
	tasks: DashboardTask[];
	query: {
		isLoading: boolean;
		isError: boolean;
		error: unknown;
		refetch: () => void;
	};
}) {
	return (
		<Widget
			title="Tasks & deadlines"
			icon={<CheckSquare className="h-4 w-4" />}
			action={<WidgetLink to="/all-tasks" label="All tasks" />}
			isLoading={query.isLoading}
			isError={query.isError}
			error={query.error}
			onRetry={query.refetch}
			isEmpty={tasks.length === 0}
			emptyText="No active tasks right now."
			emptyTo="/all-tasks"
			emptyAction="Open tasks"
		>
			<ul className="flex flex-col gap-1">
				{tasks.slice(0, 6).map((task) => (
					<li key={task.TaskId}>
						<a
							href={task.Url}
							onClick={(event) => {
								event.preventDefault();
								void window.app.openExternal(task.Url);
							}}
							className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-accent"
						>
							<span
								className={cn(
									"h-2 w-2 shrink-0 rounded-full",
									urgencyDot[task.urgency],
								)}
							/>
							<div className="min-w-0 flex-1">
								<p className="truncate text-sm font-medium">{task.Title}</p>
								<p className="truncate text-xs text-muted-foreground">
									{task.LocationTitle || task.LocationFriendlyName || "Task"}
								</p>
							</div>
							<Badge
								variant="outline"
								className={cn(
									"shrink-0 font-normal",
									urgencyText[task.urgency],
								)}
							>
								{formatDueLabel(task.deadline)}
							</Badge>
						</a>
					</li>
				))}
			</ul>
		</Widget>
	);
}

/* -------------------------------------------------------------------------- */
/* Calendar                                                                   */
/* -------------------------------------------------------------------------- */

function CalendarWidget({
	groups,
	query,
}: {
	groups: { key: string; label: string; items: NormalizedCalendarEvent[] }[];
	query: {
		isLoading: boolean;
		isError: boolean;
		error: unknown;
		refetch: () => void;
	};
}) {
	return (
		<Widget
			title="Upcoming calendar"
			icon={<CalendarDays className="h-4 w-4" />}
			action={<WidgetLink to="/calendar" label="Calendar" />}
			isLoading={query.isLoading}
			isError={query.isError}
			error={query.error}
			onRetry={query.refetch}
			isEmpty={groups.length === 0}
			emptyText="No upcoming events."
			emptyTo="/calendar"
			emptyAction="Open calendar"
		>
			<div className="flex flex-col gap-3">
				{groups.map((group) => (
					<div key={group.key}>
						<p className="px-2 pb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
							{group.label}
						</p>
						<div className="flex flex-col gap-1">
							{group.items.map((event) => (
								<Link
									key={event.id}
									to="/calendar"
									className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-accent"
								>
									<div className="flex w-14 shrink-0 flex-col items-center rounded-md border bg-background py-1">
										<span className="text-xs font-semibold leading-tight">
											{event.startsAt ? formatTime(event.startsAt) : "--"}
										</span>
									</div>
									<div className="min-w-0 flex-1">
										<p className="truncate text-sm font-medium">
											{event.title}
										</p>
										<p className="truncate text-xs text-muted-foreground">
											{event.courseTitle ||
												event.location ||
												formatEventTimeRange(event)}
										</p>
									</div>
								</Link>
							))}
						</div>
					</div>
				))}
			</div>
		</Widget>
	);
}

/* -------------------------------------------------------------------------- */
/* Messages                                                                   */
/* -------------------------------------------------------------------------- */

function MessagesWidget({
	threads,
	query,
}: {
	threads: DashboardThread[];
	query: {
		isLoading: boolean;
		isError: boolean;
		error: unknown;
		refetch: () => void;
	};
}) {
	return (
		<Widget
			title="Messages"
			icon={<MessageSquare className="h-4 w-4" />}
			action={<WidgetLink to="/messages" label="Inbox" />}
			isLoading={query.isLoading}
			isError={query.isError}
			error={query.error}
			onRetry={query.refetch}
			isEmpty={threads.length === 0}
			emptyText="No recent message threads."
			emptyTo="/messages"
			emptyAction="Open messages"
		>
			<ul className="flex flex-col gap-1">
				{threads.slice(0, 5).map((thread) => (
					<li key={thread.InstantMessageThreadId}>
						<Link
							to={`/messages/${thread.InstantMessageThreadId}`}
							className="flex items-start gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-accent"
						>
							<span
								className={cn(
									"mt-1.5 h-2 w-2 shrink-0 rounded-full",
									thread.unread ? "bg-primary" : "bg-transparent",
								)}
							/>
							<div className="min-w-0 flex-1">
								<div className="flex items-center justify-between gap-2">
									<p
										className={cn(
											"truncate text-sm",
											thread.unread ? "font-semibold" : "font-medium",
										)}
									>
										{thread.Name ||
											thread.LastMessage?.CreatedByName ||
											"Thread"}
									</p>
									<span className="shrink-0 text-xs text-muted-foreground">
										{messageAge(thread)}
									</span>
								</div>
								<p className="truncate text-xs text-muted-foreground">
									{thread.LastMessage?.Text || "No preview available"}
								</p>
							</div>
						</Link>
					</li>
				))}
			</ul>
		</Widget>
	);
}

/* -------------------------------------------------------------------------- */
/* Pinned courses                                                             */
/* -------------------------------------------------------------------------- */

function PinnedCoursesWidget({
	courses,
	query,
}: {
	courses: ItslearningRestApiEntitiesCourseCard[];
	query: {
		isLoading: boolean;
		isError: boolean;
		error: unknown;
		refetch: () => void;
	};
}) {
	return (
		<Widget
			title="Pinned courses"
			icon={<Star className="h-4 w-4" />}
			action={<WidgetLink to="/courses" label="All courses" />}
			isLoading={query.isLoading}
			isError={query.isError}
			error={query.error}
			onRetry={query.refetch}
			isEmpty={courses.length === 0}
			emptyText="No starred courses yet."
			emptyTo="/courses"
			emptyAction="Browse courses"
		>
			<div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
				{courses.slice(0, 6).map((course) => {
					const notifications =
						course.NumberOfTasks +
						course.NumberOfAnnouncements +
						course.NumberOfFollowUpTasks;
					return (
						<Link
							key={course.CourseId}
							to={`/courses/${course.CourseId}`}
							className="flex flex-col gap-2 rounded-lg border bg-background p-3 transition-colors hover:bg-accent"
						>
							<div className="flex items-start gap-2">
								<span
									className={cn(
										"mt-1 h-2.5 w-2.5 shrink-0 rounded-full",
										courseAccent(course.CourseId),
									)}
								/>
								<div className="min-w-0 flex-1">
									<p className="truncate text-sm font-medium">{course.Title}</p>
									<p className="truncate text-xs text-muted-foreground">
										{course.LastOnlineDisplayTime ||
											course.LastUpdatedDisplayTime ||
											"No recent activity"}
									</p>
								</div>
								<Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" />
							</div>
							{notifications > 0 && (
								<Badge variant="secondary" className="w-fit font-normal">
									{notifications} new
								</Badge>
							)}
						</Link>
					);
				})}
			</div>
		</Widget>
	);
}

/* -------------------------------------------------------------------------- */
/* Recent resources                                                           */
/* -------------------------------------------------------------------------- */

function RecentResourcesWidget({
	recent,
}: {
	recent: ReturnType<typeof useCachedResources>;
}) {
	return (
		<Widget
			title="Recent resources"
			icon={<FileIcon className="h-4 w-4" />}
			action={<WidgetLink to="/resources" label="View all" />}
			isLoading={recent.isLoading}
			isError={recent.isError}
			error={recent.error}
			onRetry={recent.refetch}
			isEmpty={recent.resources.length === 0}
			emptyText="No cached resources yet. Files you open appear here."
		>
			<ul className="flex flex-col gap-1">
				{recent.resources.slice(0, 6).map((resource) => {
					const route = getResourceOpenRoute(resource.name, resource.elementId);
					return (
						<li key={resource.elementId}>
							<Link
								to={route.pathname}
								state={route.state}
								className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-accent"
							>
								<ResourceTypeBadge name={resource.name} />
								<div className="min-w-0 flex-1">
									<p className="truncate text-sm font-medium">
										{resource.name}
									</p>
									<p className="truncate text-xs text-muted-foreground">
										{resource.CourseTitle || "Cached resource"}
									</p>
								</div>
								<div className="shrink-0 text-right">
									<p className="text-xs text-muted-foreground">
										{formatSize(resource.size)}
									</p>
									<p className="text-[11px] text-muted-foreground/70">
										{formatShortDate(resource.last_accessed)}
									</p>
								</div>
							</Link>
						</li>
					);
				})}
			</ul>
		</Widget>
	);
}

/* -------------------------------------------------------------------------- */
/* Continue where you left off (optional, only when data exists)              */
/* -------------------------------------------------------------------------- */

function ContinueWidget({
	resources,
}: {
	resources: CachedResourceSummary[];
}) {
	const items = resources.slice(0, 3);
	if (items.length === 0) return null;

	return (
		<section className="flex flex-col rounded-xl border bg-card">
			<header className="flex items-center gap-2 border-b px-4 py-3">
				<span className="text-muted-foreground">
					<ArrowRight className="h-4 w-4" />
				</span>
				<h2 className="truncate text-sm font-semibold">
					Continue where you left off
				</h2>
			</header>
			<div className="flex flex-col gap-1 p-3">
				{items.map((resource) => {
					const route = getResourceOpenRoute(resource.name, resource.elementId);
					return (
						<Link
							key={resource.elementId}
							to={route.pathname}
							state={route.state}
							className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-accent"
						>
							<ResourceTypeBadge name={resource.name} />
							<div className="min-w-0 flex-1">
								<p className="truncate text-sm font-medium">{resource.name}</p>
								<p className="truncate text-xs text-muted-foreground">
									{resource.CourseTitle || "Recently opened"}
								</p>
							</div>
							<ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
						</Link>
					);
				})}
			</div>
		</section>
	);
}

/* -------------------------------------------------------------------------- */
/* Shared widget shell + states                                               */
/* -------------------------------------------------------------------------- */

function Widget({
	title,
	icon,
	action,
	isLoading,
	isError,
	error,
	onRetry,
	isEmpty,
	emptyText,
	emptyTo,
	emptyAction,
	children,
}: {
	title: string;
	icon: React.ReactNode;
	action?: React.ReactNode;
	isLoading: boolean;
	isError: boolean;
	error?: unknown;
	onRetry?: () => void;
	isEmpty?: boolean;
	emptyText: string;
	emptyTo?: string;
	emptyAction?: string;
	children: React.ReactNode;
}) {
	return (
		<section className="flex flex-col rounded-xl border bg-card">
			<header className="flex items-center justify-between gap-2 border-b px-4 py-3">
				<div className="flex min-w-0 items-center gap-2">
					<span className="text-muted-foreground">{icon}</span>
					<h2 className="truncate text-sm font-semibold">{title}</h2>
				</div>
				{action}
			</header>
			<div className="p-3">
				{isLoading ? (
					<WidgetSkeleton />
				) : isError ? (
					<WidgetError error={error} onRetry={onRetry} />
				) : isEmpty ? (
					<WidgetEmpty text={emptyText} to={emptyTo} action={emptyAction} />
				) : (
					children
				)}
			</div>
		</section>
	);
}

function WidgetLink({ to, label }: { to: string; label: string }) {
	return (
		<Link
			to={to}
			className="flex shrink-0 items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
		>
			{label}
			<ArrowRight className="h-3 w-3" />
		</Link>
	);
}

function WidgetSkeleton() {
	return (
		<div className="flex flex-col gap-2">
			<Skeleton className="h-10 w-full" />
			<Skeleton className="h-10 w-full" />
			<Skeleton className="h-10 w-4/5" />
		</div>
	);
}

function WidgetEmpty({
	text,
	to,
	action,
}: {
	text: string;
	to?: string;
	action?: string;
}) {
	return (
		<div className="flex flex-col items-center justify-center gap-2 px-4 py-6 text-center">
			<Inbox className="h-5 w-5 text-muted-foreground" />
			<p className="text-sm text-muted-foreground">{text}</p>
			{to && action && (
				<Button asChild variant="outline" size="sm" className="mt-1">
					<Link to={to}>{action}</Link>
				</Button>
			)}
		</div>
	);
}

function WidgetError({
	error,
	onRetry,
}: {
	error?: unknown;
	onRetry?: () => void;
}) {
	const message =
		import.meta.env.DEV && error instanceof Error ? error.message : null;

	return (
		<div className="flex flex-col items-center justify-center gap-2 px-4 py-6 text-center">
			<AlertTriangle className="h-5 w-5 text-muted-foreground" />
			<p className="text-sm text-muted-foreground">
				This widget couldn't load.
			</p>
			{message && (
				<p className="max-w-full truncate text-xs text-destructive/80">
					{message}
				</p>
			)}
			{onRetry && (
				<Button
					type="button"
					variant="outline"
					size="sm"
					className="mt-1"
					onClick={onRetry}
				>
					<RefreshCcw className="mr-2 h-3.5 w-3.5" />
					Retry
				</Button>
			)}
		</div>
	);
}

function WidgetBoundary({ children }: { children: React.ReactNode }) {
	return (
		<ErrorBoundary
			fallback={
				<section className="flex flex-col items-center justify-center gap-1 rounded-xl border bg-card p-6 text-center">
					<AlertTriangle className="h-5 w-5 text-muted-foreground" />
					<p className="text-sm text-muted-foreground">
						This section couldn't be displayed.
					</p>
				</section>
			}
		>
			{children}
		</ErrorBoundary>
	);
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                     */
/* -------------------------------------------------------------------------- */

const urgencyDot: Record<TaskUrgency, string> = {
	overdue: "bg-destructive",
	today: "bg-amber-500",
	upcoming: "bg-primary",
	none: "bg-muted-foreground/40",
};

const urgencyText: Record<TaskUrgency, string> = {
	overdue: "border-destructive/40 text-destructive",
	today: "border-amber-500/40 text-amber-600 dark:text-amber-400",
	upcoming: "text-muted-foreground",
	none: "text-muted-foreground",
};

const courseAccentPalette = [
	"bg-orange-500",
	"bg-blue-500",
	"bg-emerald-500",
	"bg-purple-500",
	"bg-rose-500",
	"bg-cyan-500",
	"bg-amber-500",
	"bg-indigo-500",
];

function courseAccent(courseId: number) {
	return courseAccentPalette[Math.abs(courseId) % courseAccentPalette.length];
}

function startOfDay(date: Date) {
	const copy = new Date(date);
	copy.setHours(0, 0, 0, 0);
	return copy;
}

function addDays(date: Date, days: number) {
	const copy = new Date(date);
	copy.setDate(copy.getDate() + days);
	return copy;
}

function parseDeadline(value: Date | string): Date | null {
	const date = new Date(value);
	// itslearning uses sentinel dates (e.g. year 0001) for "no deadline".
	if (Number.isNaN(date.getTime()) || date.getFullYear() < 2000) return null;
	return date;
}

function classifyUrgency(deadline: Date | null): TaskUrgency {
	if (!deadline) return "none";
	const now = new Date();
	if (deadline < now) return "overdue";
	if (deadline < startOfDay(addDays(now, 1))) return "today";
	return "upcoming";
}

function formatDueLabel(deadline: Date | null) {
	if (!deadline) return "No due date";
	const days = Math.round(
		(startOfDay(deadline).getTime() - startOfDay(new Date()).getTime()) /
			86_400_000,
	);
	if (days === 0) return `Today ${formatTime(deadline)}`;
	if (days === 1) return "Tomorrow";
	if (days === -1) return "1d overdue";
	if (days < 0) return `${Math.abs(days)}d overdue`;
	if (days < 7) return `In ${days}d`;
	return new Intl.DateTimeFormat(undefined, {
		month: "short",
		day: "numeric",
	}).format(deadline);
}

function messageAge(thread: DashboardThread) {
	const relative = thread.LastMessage?.CreatedRelative;
	if (relative) return relative;
	const created = thread.LastMessage?.Created ?? thread.Created;
	if (!created) return "";
	const date = new Date(created);
	if (Number.isNaN(date.getTime())) return "";
	return formatShortDate(date);
}

function formatTime(date: Date) {
	return new Intl.DateTimeFormat(undefined, {
		hour: "2-digit",
		minute: "2-digit",
	}).format(date);
}

function formatShortDate(date: Date) {
	return new Intl.DateTimeFormat(undefined, {
		month: "short",
		day: "numeric",
	}).format(date);
}
