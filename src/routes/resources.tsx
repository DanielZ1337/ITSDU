import { ResourceTypeBadge } from "@/components/resources/resource-type-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useCachedResources } from "@/hooks/useCachedResources";
import {
	formatDateShort,
	formatSize,
	getResourceKind,
	getResourceOpenRoute,
} from "@/lib/resources/resource-format";
import { cn } from "@/lib/utils";
import {
	AlertTriangle,
	CheckCircle2,
	Database,
	FolderOpen,
	Inbox,
	RefreshCcw,
	Search,
	Trash2,
	WifiOff,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { toast } from "sonner";

type CacheFilter = "all" | "cached" | "problem";
type SortMode = "recent" | "filename" | "course" | "size" | "cached";

const cacheFilterLabels: Record<CacheFilter, string> = {
	all: "All statuses",
	cached: "Available offline",
	problem: "Needs cleanup",
};

const sortLabels: Record<SortMode, string> = {
	recent: "Recently opened",
	filename: "Filename",
	course: "Course",
	size: "Size",
	cached: "Cached date",
};

export default function Resources() {
	const {
		resources,
		health,
		isLoading,
		isError,
		error,
		refetch,
		removeResource,
		clearProblemResources,
	} = useCachedResources();
	const [query, setQuery] = useState("");
	const [cacheFilter, setCacheFilter] = useState<CacheFilter>("all");
	const [courseFilter, setCourseFilter] = useState("all");
	const [typeFilter, setTypeFilter] = useState("all");
	const [sortMode, setSortMode] = useState<SortMode>("recent");
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

	const courseOptions = useMemo(
		() =>
			Array.from(
				new Set(
					resources.map((resource) => resource.CourseTitle).filter(Boolean),
				),
			).sort((a, b) => String(a).localeCompare(String(b))),
		[resources],
	);

	const typeOptions = useMemo(
		() =>
			Array.from(
				new Set(
					resources.map((resource) =>
						getResourceKind(resource.name, resource.mimeType),
					),
				),
			).sort(),
		[resources],
	);

	const filtered = useMemo(() => {
		const normalized = query.trim().toLowerCase();
		return resources
			.filter((resource) => {
				const matchesSearch =
					normalized.length === 0 ||
					`${resource.name} ${resource.CourseTitle ?? ""}`
						.toLowerCase()
						.includes(normalized);
				const matchesStatus =
					cacheFilter === "all" ||
					(cacheFilter === "cached" && resource.cacheStatus === "cached") ||
					(cacheFilter === "problem" && resource.cacheStatus !== "cached");
				const matchesCourse =
					courseFilter === "all" || resource.CourseTitle === courseFilter;
				const matchesType =
					typeFilter === "all" ||
					getResourceKind(resource.name, resource.mimeType) === typeFilter;
				return matchesSearch && matchesStatus && matchesCourse && matchesType;
			})
			.sort((a, b) => {
				switch (sortMode) {
					case "filename":
						return a.name.localeCompare(b.name);
					case "course":
						return (a.CourseTitle ?? "").localeCompare(b.CourseTitle ?? "");
					case "size":
						return b.size - a.size;
					case "cached":
						return (
							new Date(b.cachedAt ?? 0).getTime() -
							new Date(a.cachedAt ?? 0).getTime()
						);
					case "recent":
					default:
						return (
							new Date(b.lastOpenedAt ?? b.last_accessed).getTime() -
							new Date(a.lastOpenedAt ?? a.last_accessed).getTime()
						);
				}
			});
	}, [cacheFilter, courseFilter, query, resources, sortMode, typeFilter]);

	const selectedResources = filtered.filter((resource) =>
		selectedIds.has(resource.elementId),
	);
	const totalSize = health?.totalSize ?? 0;
	const problemCount =
		(health?.missingCount ?? 0) +
		(health?.failedCount ?? 0) +
		(health?.staleCount ?? 0);

	const toggleSelected = (elementId: string) => {
		setSelectedIds((current) => {
			const next = new Set(current);
			if (next.has(elementId)) {
				next.delete(elementId);
			} else {
				next.add(elementId);
			}
			return next;
		});
	};

	const removeSelected = async () => {
		await Promise.all(
			selectedResources.map((resource) => removeResource(resource.elementId)),
		);
		setSelectedIds(new Set());
		toast.success(
			`Removed ${selectedResources.length} cached resource${
				selectedResources.length === 1 ? "" : "s"
			}`,
		);
	};

	return (
		<div className="mx-auto flex w-full max-w-7xl flex-col gap-4 p-4 pb-12 sm:gap-5 sm:p-6 lg:p-8">
			<Helmet>
				<title>Resources</title>
			</Helmet>

			<header className="overflow-hidden rounded-xl border bg-card">
				<div className="flex flex-col gap-4 border-b bg-muted/20 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
					<div className="flex min-w-0 items-center gap-3">
						<div className="flex h-11 w-11 items-center justify-center rounded-md border bg-background">
							<Database className="h-5 w-5" />
						</div>
						<div className="min-w-0">
							<h1 className="text-2xl font-semibold tracking-tight">
								Resource library
							</h1>
							<p className="truncate text-sm text-muted-foreground">
								Local study files, offline cache, and recently opened resources.
							</p>
						</div>
					</div>
					<div className="flex flex-wrap items-center gap-2">
						<Button asChild variant="outline" size="sm">
							<Link to="/courses">Browse courses</Link>
						</Button>
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => void refetch()}
						>
							<RefreshCcw className="mr-2 h-3.5 w-3.5" />
							Refresh
						</Button>
					</div>
				</div>

				<div className="grid gap-3 p-5 sm:grid-cols-3 sm:p-6">
					<HealthStat
						label="Available offline"
						value={health?.cachedCount ?? 0}
						detail={formatSize(totalSize)}
						tone="success"
					/>
					<HealthStat
						label="Needs cleanup"
						value={problemCount}
						detail={
							problemCount > 0
								? "Missing, stale, or failed"
								: "Cache is healthy"
						}
						tone={problemCount > 0 ? "warning" : "neutral"}
					/>
					<HealthStat
						label="Last opened"
						value={
							health?.newestAccessedAt
								? formatDateShort(health.newestAccessedAt)
								: "Never"
						}
						detail={`${resources.length} total resource${
							resources.length === 1 ? "" : "s"
						}`}
						tone="neutral"
					/>
				</div>
			</header>

			<section className="rounded-xl border bg-card">
				<div className="flex flex-col gap-3 border-b p-4 lg:flex-row lg:items-center">
					<div className="relative min-w-0 flex-1">
						<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							value={query}
							onChange={(event) => setQuery(event.target.value)}
							placeholder="Search filename or course..."
							className="pl-9"
						/>
					</div>
					<div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:flex">
						<FilterSelect
							value={cacheFilter}
							onValueChange={(value) => setCacheFilter(value as CacheFilter)}
							options={Object.entries(cacheFilterLabels)}
						/>
						<FilterSelect
							value={typeFilter}
							onValueChange={setTypeFilter}
							options={[
								["all", "All types"],
								...typeOptions.map((type) => [type, type] as [string, string]),
							]}
						/>
						<FilterSelect
							value={courseFilter}
							onValueChange={setCourseFilter}
							options={[
								["all", "All courses"],
								...courseOptions.map(
									(course) =>
										[String(course), String(course)] as [string, string],
								),
							]}
						/>
						<FilterSelect
							value={sortMode}
							onValueChange={(value) => setSortMode(value as SortMode)}
							options={Object.entries(sortLabels)}
						/>
					</div>
				</div>

				{selectedResources.length > 0 && (
					<div className="flex flex-wrap items-center justify-between gap-2 border-b bg-muted/20 px-4 py-2">
						<p className="text-sm text-muted-foreground">
							{selectedResources.length} selected
						</p>
						<Button
							type="button"
							variant="destructive"
							size="sm"
							onClick={() => void removeSelected()}
						>
							<Trash2 className="mr-2 h-3.5 w-3.5" />
							Remove selected
						</Button>
					</div>
				)}

				{problemCount > 0 && (
					<div className="flex flex-wrap items-center justify-between gap-2 border-b bg-amber-500/10 px-4 py-2 text-sm">
						<div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
							<AlertTriangle className="h-4 w-4" />
							{problemCount} cache record{problemCount === 1 ? "" : "s"} need
							cleanup.
						</div>
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={async () => {
								const removed = await clearProblemResources();
								toast.success(
									removed
										? `Removed ${removed} stale record${
												removed === 1 ? "" : "s"
											}`
										: "No stale records found",
								);
							}}
						>
							Clear stale
						</Button>
					</div>
				)}

				{isLoading ? (
					<div className="flex flex-col gap-2 p-4">
						<Skeleton className="h-14 w-full" />
						<Skeleton className="h-14 w-full" />
						<Skeleton className="h-14 w-4/5" />
					</div>
				) : isError ? (
					<div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
						<AlertTriangle className="h-5 w-5 text-muted-foreground" />
						<p className="text-sm text-muted-foreground">
							The resource cache couldn't be read.
						</p>
						{import.meta.env.DEV && error instanceof Error && (
							<p className="max-w-full truncate text-xs text-destructive/80">
								{error.message}
							</p>
						)}
						<Button
							type="button"
							variant="outline"
							size="sm"
							className="mt-1"
							onClick={() => void refetch()}
						>
							<RefreshCcw className="mr-2 h-3.5 w-3.5" />
							Retry
						</Button>
					</div>
				) : filtered.length === 0 ? (
					<div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
						<Inbox className="h-5 w-5 text-muted-foreground" />
						<p className="text-sm text-muted-foreground">
							{resources.length === 0
								? "No cached resources yet. Files you open or cache manually appear here."
								: "No resources match the current filters."}
						</p>
					</div>
				) : (
					<ul className="flex flex-col divide-y">
						{filtered.map((resource) => {
							const route = getResourceOpenRoute(
								resource.name,
								resource.elementId,
							);
							const isSelected = selectedIds.has(resource.elementId);
							const isCached = resource.cacheStatus === "cached";
							return (
								<li
									key={resource.elementId}
									className={cn(
										"flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/40",
										isSelected && "bg-primary/5",
									)}
								>
									<input
										type="checkbox"
										checked={isSelected}
										onChange={() => toggleSelected(resource.elementId)}
										className="h-4 w-4 rounded border-border"
										aria-label={`Select ${resource.name}`}
									/>
									<ResourceTypeBadge
										name={resource.name}
										mimeType={resource.mimeType}
									/>
									<div className="min-w-0 flex-1">
										<div className="flex min-w-0 items-center gap-2">
											<p className="truncate text-sm font-medium">
												{resource.name}
											</p>
											<CacheStatusBadge cached={isCached} />
										</div>
										<p className="truncate text-xs text-muted-foreground">
											{resource.CourseTitle || "Cached resource"} ·{" "}
											{getResourceKind(resource.name, resource.mimeType)}
										</p>
									</div>
									<div className="hidden w-24 shrink-0 text-right text-xs text-muted-foreground sm:block">
										{formatSize(resource.size)}
									</div>
									<div className="hidden w-28 shrink-0 text-right text-xs text-muted-foreground md:block">
										{formatDateShort(
											resource.lastOpenedAt ?? resource.last_accessed,
										)}
									</div>
									<div className="flex shrink-0 items-center gap-1">
										<Button asChild variant="ghost" size="icon" title="Open">
											<Link to={route.pathname} state={route.state}>
												<FolderOpen className="h-4 w-4" />
											</Link>
										</Button>
										<Button
											type="button"
											variant="ghost"
											size="icon"
											title="Remove from cache"
											onClick={() => {
												if (
													window.confirm(
														`Remove "${resource.name}" from the resource cache?`,
													)
												) {
													void removeResource(resource.elementId);
												}
											}}
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>
								</li>
							);
						})}
					</ul>
				)}
			</section>
		</div>
	);
}

function HealthStat({
	label,
	value,
	detail,
	tone,
}: {
	label: string;
	value: string | number;
	detail: string;
	tone: "success" | "warning" | "neutral";
}) {
	return (
		<div className="rounded-lg border bg-background/60 p-3">
			<p className="text-xs font-medium uppercase text-muted-foreground">
				{label}
			</p>
			<div className="mt-1 flex items-baseline gap-2">
				<p
					className={cn(
						"text-xl font-semibold",
						tone === "success" && "text-emerald-600 dark:text-emerald-400",
						tone === "warning" && "text-amber-600 dark:text-amber-400",
					)}
				>
					{value}
				</p>
				<p className="truncate text-xs text-muted-foreground">{detail}</p>
			</div>
		</div>
	);
}

function FilterSelect({
	value,
	onValueChange,
	options,
}: {
	value: string;
	onValueChange: (value: string) => void;
	options: [string, string][];
}) {
	return (
		<Select value={value} onValueChange={onValueChange}>
			<SelectTrigger className="h-9 min-w-0 lg:w-[160px]">
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				{options.map(([optionValue, label]) => (
					<SelectItem key={optionValue} value={optionValue}>
						{label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}

function CacheStatusBadge({ cached }: { cached: boolean }) {
	if (cached) {
		return (
			<Badge
				variant="outline"
				className="hidden gap-1 border-emerald-500/30 bg-emerald-500/10 text-[10px] font-normal text-emerald-700 dark:text-emerald-300 sm:inline-flex"
			>
				<CheckCircle2 className="h-3 w-3" />
				Offline
			</Badge>
		);
	}

	return (
		<Badge
			variant="outline"
			className="hidden gap-1 border-amber-500/30 bg-amber-500/10 text-[10px] font-normal text-amber-700 dark:text-amber-300 sm:inline-flex"
		>
			<WifiOff className="h-3 w-3" />
			Needs connection
		</Badge>
	);
}
