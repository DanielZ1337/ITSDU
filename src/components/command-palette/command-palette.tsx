import { updateReadyAtom } from "@/atoms/update-status";
import { sectionIds, sectionMeta } from "@/components/settings/settings-modal";
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut,
} from "@/components/ui/command";
import { useCommandPalette } from "@/hooks/atoms/useCommandPalette";
import { useSettings } from "@/hooks/atoms/useSettings";
import { useShowSettingsModal } from "@/hooks/atoms/useSettingsModal";
import {
	type NormalizedCalendarEvent,
	normalizeCalendarEvents,
} from "@/lib/calendar/calendar-events";
import { ItsduResourcesDBWrapper } from "@/lib/resource-indexeddb/resourceIndexedDB";
import { getResourceOpenRoute } from "@/lib/resources/resource-format";
import { navlinks } from "@/lib/routes";
import useGETcalendarEvents from "@/queries/calendar/useGETcalendarEvents";
import useGETstarredCourses from "@/queries/course-cards/useGETstarredCourses";
import useGETunstarredCourses from "@/queries/course-cards/useGETunstarredCourses";
import useGETinstantMessagesv2 from "@/queries/messages/useGETinstantMessagesv2";
import useGETpersonalTasks from "@/queries/tasks/useGETpersonalTasks";
import { ItslearningRestApiEntitiesTaskDeadlineFilter } from "@/types/api-types/utils/Itslearning.RestApi.Entities.TaskDeadlineFilter";
import { ItslearningRestApiEntitiesTaskStatusFilter } from "@/types/api-types/utils/Itslearning.RestApi.Entities.TaskStatusFilter";
import { useDebounce } from "@uidotdev/usehooks";
import { useAtomValue } from "jotai";
import {
	CalendarDays,
	CheckSquare,
	FolderOpen,
	GraduationCap,
	LogOut,
	MessageSquare,
	Moon,
	RefreshCcw,
	RotateCw,
	Trash2,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type CachedResourceResult = {
	elementId: string;
	name: string;
	courseTitle?: string;
};

const quickNavShortcuts: Record<string, string> = {
	"/overview": "⌘1",
	"/courses": "⌘2",
	"/calendar": "⌘3",
	"/all-tasks": "⌘4",
	"/messages": "⌘5",
};

export default function CommandPalette() {
	const { isCommandPaletteOpen, setIsCommandPaletteOpen } = useCommandPalette();
	const navigate = useNavigate();
	const { settings, setSetting } = useSettings();
	const { openSettingsSection } = useShowSettingsModal();
	const { resolvedTheme, setTheme } = useTheme();
	const updateReady = useAtomValue(updateReadyAtom);

	const [query, setQuery] = useState("");
	const debouncedQuery = useDebounce(query, 250);
	const normalizedQuery = debouncedQuery.trim().toLowerCase();

	useEffect(() => {
		if (!isCommandPaletteOpen) setQuery("");
	}, [isCommandPaletteOpen]);

	const close = (callback?: () => void) => {
		setIsCommandPaletteOpen(false);
		callback?.();
	};

	// Cached resources live in IndexedDB, not the network - read once per open
	// and filter in memory so typing never triggers extra fetches.
	const [cachedResources, setCachedResources] = useState<
		CachedResourceResult[]
	>([]);

	useEffect(() => {
		if (!isCommandPaletteOpen) return;
		let isMounted = true;

		void (async () => {
			try {
				const db = await ItsduResourcesDBWrapper.getInstance();
				const resources = await db.getAllResources();
				if (!isMounted) return;
				setCachedResources(
					resources.map((resource) => ({
						elementId: resource.elementId,
						name:
							"name" in resource && typeof resource.name === "string"
								? resource.name
								: resource.elementId,
						courseTitle: resource.CourseTitle,
					})),
				);
			} catch (error) {
				console.error(error);
			}
		})();

		return () => {
			isMounted = false;
		};
	}, [isCommandPaletteOpen]);

	const { data: starredCourses } = useGETstarredCourses(
		{ PageIndex: 0, PageSize: 30, searchText: debouncedQuery, sortBy: "Rank" },
		{ enabled: isCommandPaletteOpen, suspense: false, keepPreviousData: true },
	);
	const { data: unstarredCourses } = useGETunstarredCourses(
		{ PageIndex: 0, PageSize: 30, searchText: debouncedQuery, sortBy: "Rank" },
		{ enabled: isCommandPaletteOpen, suspense: false, keepPreviousData: true },
	);

	const tasksQuery = useGETpersonalTasks(
		{
			PageIndex: 0,
			PageSize: 50,
			status: ItslearningRestApiEntitiesTaskStatusFilter.Active,
			deadline: ItslearningRestApiEntitiesTaskDeadlineFilter.All,
		},
		{
			enabled: isCommandPaletteOpen,
			suspense: false,
			staleTime: 1000 * 60 * 2,
		},
	);

	const calendarQuery = useGETcalendarEvents(
		{ fromDate: new Date(), page: 0, pageSize: 40 },
		{
			enabled: isCommandPaletteOpen,
			suspense: false,
			staleTime: 1000 * 60 * 2,
		},
	);

	const messagesQuery = useGETinstantMessagesv2(
		{ maxThreadCount: 20, threadPage: 0, maxMessages: 1 },
		{ enabled: isCommandPaletteOpen, staleTime: 1000 * 60 * 2 },
	);

	const filteredResources = useMemo(() => {
		const matches =
			normalizedQuery.length === 0
				? cachedResources
				: cachedResources.filter((resource) =>
						`${resource.name} ${resource.courseTitle ?? ""}`
							.toLowerCase()
							.includes(normalizedQuery),
					);
		return matches.slice(0, 6);
	}, [cachedResources, normalizedQuery]);

	const filteredTasks = useMemo(() => {
		const tasks = tasksQuery.data?.EntityArray ?? [];
		const matches =
			normalizedQuery.length === 0
				? tasks
				: tasks.filter((task) =>
						`${task.Title} ${task.LocationTitle ?? ""}`
							.toLowerCase()
							.includes(normalizedQuery),
					);
		return [...matches]
			.sort(
				(a, b) =>
					new Date(a.Deadline).getTime() - new Date(b.Deadline).getTime(),
			)
			.slice(0, 6);
	}, [tasksQuery.data, normalizedQuery]);

	const filteredEvents = useMemo(() => {
		const events = normalizeCalendarEvents(
			calendarQuery.data?.EntityArray ?? [],
		).filter((event) => !event.isPast);
		const matches =
			normalizedQuery.length === 0
				? events
				: events.filter((event) =>
						`${event.title} ${event.location ?? ""} ${event.courseTitle ?? ""}`
							.toLowerCase()
							.includes(normalizedQuery),
					);
		return matches.slice(0, 6);
	}, [calendarQuery.data, normalizedQuery]);

	const filteredThreads = useMemo(() => {
		const threads =
			messagesQuery.data?.pages.flatMap((page) => page.EntityArray) ?? [];
		const matches =
			normalizedQuery.length === 0
				? threads
				: threads.filter((thread) =>
						`${thread.Name ?? ""} ${thread.LastMessage?.Text ?? ""} ${thread.LastMessage?.CreatedByName ?? ""}`
							.toLowerCase()
							.includes(normalizedQuery),
					);
		return matches.slice(0, 6);
	}, [messagesQuery.data, normalizedQuery]);

	const courseResults = useMemo(
		() =>
			[
				...(starredCourses?.EntityArray ?? []),
				...(unstarredCourses?.EntityArray ?? []),
			].slice(0, 8),
		[starredCourses, unstarredCourses],
	);

	const toggleTheme = () => {
		const next = resolvedTheme === "dark" ? "light" : "dark";
		setTheme(next);
		void setSetting("theme", next);
	};

	const checkForUpdates = async () => {
		try {
			const result = await window.app.checkForUpdates();
			if (result?.version) {
				toast.info(`Update available: v${result.version}`);
			} else {
				toast.success("ITSDU is up to date.");
			}
		} catch (error) {
			console.error(error);
			toast.error("Could not check for updates.");
		}
	};

	const restartToInstall = async () => {
		await window.app.update();
		await window.app.exit();
	};

	const openDownloadsFolder = async () => {
		const directory =
			settings.downloadDirectory ?? (await window.app.getDownloadPath());
		await window.app.openShell(directory);
	};

	const clearResourceCache = async () => {
		if (!window.confirm("Clear all cached resources? This cannot be undone.")) {
			return;
		}
		const db = await ItsduResourcesDBWrapper.getInstance();
		await db.clearResources();
		toast.success("Resource cache cleared");
	};

	const logout = async () => {
		if (!window.confirm("Log out of ITSDU?")) return;
		await window.auth.logout();
	};

	const openEvent = (event: NormalizedCalendarEvent) => {
		navigate(
			event.numericId ? `/calendar?eventId=${event.numericId}` : "/calendar",
		);
	};

	return (
		<CommandDialog
			open={isCommandPaletteOpen}
			onOpenChange={setIsCommandPaletteOpen}
		>
			<CommandInput
				autoFocus
				placeholder="Search courses, resources, tasks, events, settings..."
				value={query}
				onValueChange={setQuery}
			/>
			<CommandList className="max-h-[480px]">
				<CommandEmpty>No results found.</CommandEmpty>

				<CommandGroup heading="Navigation">
					{navlinks.map((link) => (
						<CommandItem
							key={link.href}
							value={`navigate ${link.title}`}
							onSelect={() => close(() => navigate(link.href))}
						>
							{link.icon}
							<span className="ml-2">{link.title}</span>
							{quickNavShortcuts[link.href] && (
								<CommandShortcut>
									{quickNavShortcuts[link.href]}
								</CommandShortcut>
							)}
						</CommandItem>
					))}
				</CommandGroup>

				{filteredEvents.length > 0 && (
					<>
						<CommandSeparator />
						<CommandGroup heading="Calendar">
							{filteredEvents.map((event) => (
								<CommandItem
									key={event.id}
									value={`event ${event.title}`}
									onSelect={() => close(() => openEvent(event))}
								>
									<CalendarDays className="h-4 w-4" />
									<span className="ml-2 truncate">{event.title}</span>
									{event.location && (
										<span className="ml-2 truncate text-xs text-muted-foreground">
											{event.location}
										</span>
									)}
								</CommandItem>
							))}
						</CommandGroup>
					</>
				)}

				{filteredTasks.length > 0 && (
					<>
						<CommandSeparator />
						<CommandGroup heading="Tasks">
							{filteredTasks.map((task) => (
								<CommandItem
									key={task.TaskId}
									value={`task ${task.Title}`}
									onSelect={() =>
										close(() => void window.app.openExternal(task.Url))
									}
								>
									<CheckSquare className="h-4 w-4" />
									<span className="ml-2 truncate">{task.Title}</span>
								</CommandItem>
							))}
						</CommandGroup>
					</>
				)}

				{filteredThreads.length > 0 && (
					<>
						<CommandSeparator />
						<CommandGroup heading="Messages">
							{filteredThreads.map((thread) => (
								<CommandItem
									key={thread.InstantMessageThreadId}
									value={`message ${thread.Name ?? thread.LastMessage?.CreatedByName ?? ""}`}
									onSelect={() =>
										close(() =>
											navigate(`/messages/${thread.InstantMessageThreadId}`),
										)
									}
								>
									<MessageSquare className="h-4 w-4" />
									<span className="ml-2 truncate">
										{thread.Name ||
											thread.LastMessage?.CreatedByName ||
											"Thread"}
									</span>
								</CommandItem>
							))}
						</CommandGroup>
					</>
				)}

				{filteredResources.length > 0 && (
					<>
						<CommandSeparator />
						<CommandGroup heading="Resources">
							{filteredResources.map((resource) => (
								<CommandItem
									key={resource.elementId}
									value={`resource ${resource.name}`}
									onSelect={() =>
										close(() => {
											const route = getResourceOpenRoute(
												resource.name,
												resource.elementId,
											);
											navigate(route.pathname, { state: route.state });
										})
									}
								>
									<FolderOpen className="h-4 w-4" />
									<span className="ml-2 truncate">{resource.name}</span>
								</CommandItem>
							))}
						</CommandGroup>
					</>
				)}

				{courseResults.length > 0 && (
					<>
						<CommandSeparator />
						<CommandGroup heading="Courses">
							{courseResults.map((course) => (
								<CommandItem
									key={course.CourseId}
									value={`course ${course.Title}`}
									onSelect={() =>
										close(() => navigate(`/courses/${course.CourseId}`))
									}
								>
									<GraduationCap className="h-4 w-4" />
									<span className="ml-2 truncate">{course.Title}</span>
								</CommandItem>
							))}
						</CommandGroup>
					</>
				)}

				<CommandSeparator />
				<CommandGroup heading="Settings">
					{sectionIds.map((id) => (
						<CommandItem
							key={id}
							value={`settings ${sectionMeta[id].label}`}
							onSelect={() => close(() => openSettingsSection(id))}
						>
							{sectionMeta[id].icon}
							<span className="ml-2">{sectionMeta[id].label}</span>
						</CommandItem>
					))}
				</CommandGroup>

				<CommandSeparator />
				<CommandGroup heading="Actions">
					<CommandItem value="toggle theme" onSelect={() => close(toggleTheme)}>
						<Moon className="h-4 w-4" />
						<span className="ml-2">Toggle theme</span>
					</CommandItem>
					<CommandItem
						value="check for updates"
						onSelect={() => close(() => void checkForUpdates())}
					>
						<RefreshCcw className="h-4 w-4" />
						<span className="ml-2">Check for updates</span>
					</CommandItem>
					{updateReady && (
						<CommandItem
							value="restart to install update"
							onSelect={() => close(() => void restartToInstall())}
						>
							<RotateCw className="h-4 w-4" />
							<span className="ml-2">Restart to install update</span>
						</CommandItem>
					)}
					<CommandItem
						value="open downloads folder"
						onSelect={() => close(() => void openDownloadsFolder())}
					>
						<FolderOpen className="h-4 w-4" />
						<span className="ml-2">Open downloads folder</span>
					</CommandItem>
					<CommandItem
						value="clear resource cache"
						onSelect={() => close(() => void clearResourceCache())}
					>
						<Trash2 className="h-4 w-4" />
						<span className="ml-2">Clear resource cache</span>
					</CommandItem>
					<CommandItem
						value="log out"
						onSelect={() => close(() => void logout())}
					>
						<LogOut className="h-4 w-4" />
						<span className="ml-2">Log out</span>
					</CommandItem>
				</CommandGroup>
			</CommandList>
		</CommandDialog>
	);
}
