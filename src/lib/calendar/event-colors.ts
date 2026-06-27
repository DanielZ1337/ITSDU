// Deterministic per-course accent system for the calendar planner.
//
// Class strings are written out in full (no interpolation) so Tailwind's JIT
// keeps them in the build. Events with a course are color-coded by course id so
// the planner is scannable at a glance; events without a course fall back to a
// calm neutral so personal items stay quiet. State (today / selected / past) is
// always communicated structurally as well, never by color alone.

export type CalendarEventAccent = {
	/** Solid fill, used for dots, spines and timeline nodes. */
	dot: string;
	/** Tinted chip background (includes a group-hover step). */
	chipBg: string;
	/** Readable accent text on a tinted background. */
	chipText: string;
	/** Soft surface tint for blocks and timeline cards. */
	soft: string;
	/** Ring color for emphasised states. */
	ring: string;
	/** Gradient start, used behind the event detail header. */
	gradient: string;
};

const PALETTE: CalendarEventAccent[] = [
	{
		dot: "bg-sky-500",
		chipBg: "bg-sky-500/10 group-hover:bg-sky-500/20",
		chipText: "text-sky-700 dark:text-sky-200",
		soft: "bg-sky-500/10",
		ring: "ring-sky-500/40",
		gradient: "from-sky-500/25",
	},
	{
		dot: "bg-violet-500",
		chipBg: "bg-violet-500/10 group-hover:bg-violet-500/20",
		chipText: "text-violet-700 dark:text-violet-200",
		soft: "bg-violet-500/10",
		ring: "ring-violet-500/40",
		gradient: "from-violet-500/25",
	},
	{
		dot: "bg-emerald-500",
		chipBg: "bg-emerald-500/10 group-hover:bg-emerald-500/20",
		chipText: "text-emerald-700 dark:text-emerald-200",
		soft: "bg-emerald-500/10",
		ring: "ring-emerald-500/40",
		gradient: "from-emerald-500/25",
	},
	{
		dot: "bg-rose-500",
		chipBg: "bg-rose-500/10 group-hover:bg-rose-500/20",
		chipText: "text-rose-700 dark:text-rose-200",
		soft: "bg-rose-500/10",
		ring: "ring-rose-500/40",
		gradient: "from-rose-500/25",
	},
	{
		dot: "bg-amber-500",
		chipBg: "bg-amber-500/10 group-hover:bg-amber-500/20",
		chipText: "text-amber-700 dark:text-amber-200",
		soft: "bg-amber-500/10",
		ring: "ring-amber-500/40",
		gradient: "from-amber-500/25",
	},
	{
		dot: "bg-cyan-500",
		chipBg: "bg-cyan-500/10 group-hover:bg-cyan-500/20",
		chipText: "text-cyan-700 dark:text-cyan-200",
		soft: "bg-cyan-500/10",
		ring: "ring-cyan-500/40",
		gradient: "from-cyan-500/25",
	},
	{
		dot: "bg-indigo-500",
		chipBg: "bg-indigo-500/10 group-hover:bg-indigo-500/20",
		chipText: "text-indigo-700 dark:text-indigo-200",
		soft: "bg-indigo-500/10",
		ring: "ring-indigo-500/40",
		gradient: "from-indigo-500/25",
	},
	{
		dot: "bg-fuchsia-500",
		chipBg: "bg-fuchsia-500/10 group-hover:bg-fuchsia-500/20",
		chipText: "text-fuchsia-700 dark:text-fuchsia-200",
		soft: "bg-fuchsia-500/10",
		ring: "ring-fuchsia-500/40",
		gradient: "from-fuchsia-500/25",
	},
];

const NEUTRAL: CalendarEventAccent = {
	dot: "bg-muted-foreground",
	chipBg: "bg-foreground/[0.06] group-hover:bg-foreground/10",
	chipText: "text-foreground/80",
	soft: "bg-foreground/[0.04]",
	ring: "ring-border",
	gradient: "from-foreground/10",
};

export function getEventAccent(courseId?: number | null): CalendarEventAccent {
	if (courseId === undefined || courseId === null) return NEUTRAL;
	return PALETTE[Math.abs(courseId) % PALETTE.length];
}
