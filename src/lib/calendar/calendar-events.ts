import type { CalendarWeekStartSetting } from "@/types/settings";
import {
	addDays,
	isToday as dateFnsIsToday,
	differenceInMinutes,
	endOfMonth,
	endOfWeek,
	format,
	isAfter,
	isBefore,
	isSameDay,
	isValid,
	isWeekend,
	startOfDay,
	startOfMonth,
	startOfWeek,
} from "date-fns";
import he from "he";
import { convert } from "html-to-text";

export type NormalizedCalendarEvent = {
	id: string;
	numericId?: number;
	title: string;
	startsAt: Date | null;
	endsAt: Date | null;
	dateKey: string | null;
	durationMinutes: number | null;
	isAllDay: boolean;
	isTimed: boolean;
	isPast: boolean;
	isToday: boolean;
	courseId?: number;
	courseTitle?: string;
	location?: string;
	description?: string;
	importDescription?: string;
	eventUrl?: string;
	source?: string;
	raw: unknown;
};

export type CalendarAgendaGroup = {
	key: "today" | "tomorrow" | "this-week" | "later" | "unknown";
	label: string;
	items: NormalizedCalendarEvent[];
};

type RawCalendarEvent = Record<string, unknown>;

type NormalizeOptions = {
	now?: Date;
	courseTitleById?: Map<number, string> | Record<number, string>;
};

export function normalizeCalendarEvents(
	events: unknown[] = [],
	options: NormalizeOptions = {},
) {
	const normalized = events.map((event) =>
		normalizeCalendarEvent(event, options),
	);
	const deduped = new Map<string, NormalizedCalendarEvent>();

	for (const event of normalized) {
		const key =
			event.numericId !== undefined
				? `id:${event.numericId}`
				: `${event.title}:${event.startsAt?.toISOString() ?? "unknown"}`;
		const existing = deduped.get(key);
		if (!existing || eventCompleteness(event) > eventCompleteness(existing)) {
			deduped.set(key, event);
		}
	}

	return Array.from(deduped.values()).sort(compareCalendarEvents);
}

export function normalizeCalendarEvent(
	input: unknown,
	options: NormalizeOptions = {},
): NormalizedCalendarEvent {
	const raw = isRawEvent(input) ? input : {};
	const now = options.now ?? new Date();
	const numericId = getNumber(raw.EventId) ?? getNumber(raw.id);
	const startsAt = parseCalendarDate(raw.FromDate);
	const endsAt = parseCalendarDate(raw.ToDate) ?? startsAt;
	const durationMinutes =
		startsAt && endsAt
			? Math.max(0, differenceInMinutes(endsAt, startsAt))
			: null;
	const isAllDay = Boolean(
		startsAt &&
			endsAt &&
			startsAt.getHours() === 0 &&
			startsAt.getMinutes() === 0 &&
			durationMinutes !== null &&
			durationMinutes >= 23 * 60,
	);
	const courseId = getNumber(raw.CourseId);
	const title = cleanText(raw.EventTitle) || "Untitled event";
	const location =
		cleanText(raw.LocationFriendlyName) ||
		cleanText(raw.LocationTitle) ||
		undefined;

	return {
		id:
			numericId !== undefined
				? String(numericId)
				: stableFallbackId(title, startsAt),
		numericId,
		title,
		startsAt,
		endsAt,
		dateKey: startsAt ? toDateKey(startsAt) : null,
		durationMinutes,
		isAllDay,
		isTimed: Boolean(startsAt && !isAllDay),
		isPast: Boolean(endsAt && isBefore(endsAt, now)),
		isToday: Boolean(startsAt && dateFnsIsToday(startsAt)),
		courseId,
		courseTitle: courseId
			? lookupCourseTitle(options.courseTitleById, courseId)
			: undefined,
		location,
		description: cleanText(raw.Description) || undefined,
		importDescription: cleanText(raw.ImportDescription) || undefined,
		eventUrl: getString(raw.EventUrl) || undefined,
		source: getString(raw.Source) || getString(raw.Provider) || undefined,
		raw: input,
	};
}

export function groupAgendaEvents(
	events: NormalizedCalendarEvent[],
	referenceDate = new Date(),
): CalendarAgendaGroup[] {
	const today = startOfDay(referenceDate);
	const tomorrow = addDays(today, 1);
	const dayAfterTomorrow = addDays(today, 2);
	const thisWeekEnd = endOfWeek(referenceDate, { weekStartsOn: 1 });

	const groups: CalendarAgendaGroup[] = [
		{ key: "today", label: "Today", items: [] },
		{ key: "tomorrow", label: "Tomorrow", items: [] },
		{ key: "this-week", label: "This week", items: [] },
		{ key: "later", label: "Later", items: [] },
		{ key: "unknown", label: "Date unknown", items: [] },
	];

	for (const event of events) {
		if (!event.startsAt) {
			groups[4].items.push(event);
			continue;
		}

		if (event.startsAt >= today && event.startsAt < tomorrow) {
			groups[0].items.push(event);
		} else if (
			event.startsAt >= tomorrow &&
			event.startsAt < dayAfterTomorrow
		) {
			groups[1].items.push(event);
		} else if (event.startsAt <= thisWeekEnd) {
			groups[2].items.push(event);
		} else {
			groups[3].items.push(event);
		}
	}

	return groups.filter((group) => group.items.length > 0);
}

export function buildMonthGrid(
	anchorDate: Date,
	weekStartsOn: CalendarWeekStartSetting,
	showWeekends: boolean,
) {
	const weekStartsOnIndex = getWeekStartsOnIndex(weekStartsOn);
	const start = startOfWeek(startOfMonth(anchorDate), {
		weekStartsOn: weekStartsOnIndex,
	});
	const end = endOfWeek(endOfMonth(anchorDate), {
		weekStartsOn: weekStartsOnIndex,
	});
	const columns = showWeekends ? 7 : 5;
	const days: Date[] = [];

	for (let day = start; !isAfter(day, end); day = addDays(day, 1)) {
		if (showWeekends || !isWeekend(day)) {
			days.push(day);
		}
	}

	const weeks: Date[][] = [];
	for (let index = 0; index < days.length; index += columns) {
		weeks.push(days.slice(index, index + columns));
	}

	return weeks;
}

export function getWeekDays(
	anchorDate: Date,
	weekStartsOn: CalendarWeekStartSetting,
	showWeekends: boolean,
) {
	const start = startOfWeek(anchorDate, {
		weekStartsOn: getWeekStartsOnIndex(weekStartsOn),
	});
	return Array.from({ length: 7 }, (_, index) => addDays(start, index)).filter(
		(day) => showWeekends || !isWeekend(day),
	);
}

export function getDateEvents(events: NormalizedCalendarEvent[], date: Date) {
	return events.filter(
		(event) => event.startsAt && isSameDay(event.startsAt, date),
	);
}

export function toDateKey(date: Date) {
	return format(date, "yyyy-MM-dd");
}

export function compareCalendarEvents(
	a: NormalizedCalendarEvent,
	b: NormalizedCalendarEvent,
) {
	if (a.startsAt && b.startsAt)
		return a.startsAt.getTime() - b.startsAt.getTime();
	if (a.startsAt) return -1;
	if (b.startsAt) return 1;
	return a.title.localeCompare(b.title);
}

export function formatEventTimeRange(event: NormalizedCalendarEvent) {
	if (!event.startsAt) return "Time unknown";
	if (event.isAllDay) return "All day";
	if (!event.endsAt || event.endsAt.getTime() === event.startsAt.getTime()) {
		return format(event.startsAt, "HH:mm");
	}
	return `${format(event.startsAt, "HH:mm")} - ${format(event.endsAt, "HH:mm")}`;
}

export function formatDuration(minutes: number | null) {
	if (minutes === null || minutes <= 0) return null;
	if (minutes < 60) return `${minutes} min`;
	const hours = Math.floor(minutes / 60);
	const remainingMinutes = minutes % 60;
	return remainingMinutes === 0
		? `${hours} hr`
		: `${hours} hr ${remainingMinutes} min`;
}

export function getWeekStartsOnIndex(weekStartsOn: CalendarWeekStartSetting) {
	return weekStartsOn === "sunday" ? 0 : 1;
}

export function parseCalendarDate(value: unknown) {
	if (value instanceof Date) return isValid(value) ? value : null;
	if (typeof value !== "string" && typeof value !== "number") return null;

	const date = new Date(value);
	if (!isValid(date) || date.getFullYear() < 1900) return null;
	return date;
}

export function cleanText(value: unknown) {
	const text = getString(value);
	if (!text) return "";

	return convert(he.decode(text.replace(/\\n/g, "\n")), {
		wordwrap: false,
		selectors: [{ selector: "a", options: { ignoreHref: true } }],
	})
		.replace(/\s+\n/g, "\n")
		.replace(/\n{3,}/g, "\n\n")
		.trim();
}

function eventCompleteness(event: NormalizedCalendarEvent) {
	return [
		event.title !== "Untitled event",
		event.startsAt,
		event.endsAt,
		event.location,
		event.description,
		event.importDescription,
		event.courseId,
		event.eventUrl,
	].filter(Boolean).length;
}

function lookupCourseTitle(
	courseTitleById: NormalizeOptions["courseTitleById"],
	courseId: number,
) {
	if (!courseTitleById) return undefined;
	if (courseTitleById instanceof Map) return courseTitleById.get(courseId);
	return courseTitleById[courseId];
}

function stableFallbackId(title: string, startsAt: Date | null) {
	return `${title}:${startsAt?.toISOString() ?? "unknown"}`;
}

function isRawEvent(value: unknown): value is RawCalendarEvent {
	return value !== null && typeof value === "object";
}

function getString(value: unknown) {
	return typeof value === "string" ? value : "";
}

function getNumber(value: unknown) {
	return typeof value === "number" && Number.isFinite(value)
		? value
		: typeof value === "string" &&
				value.trim() !== "" &&
				Number.isFinite(Number(value))
			? Number(value)
			: undefined;
}
