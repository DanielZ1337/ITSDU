import { ResourceTypeBadge } from "@/components/resources/resource-type-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useCachedResources } from "@/hooks/useCachedResources";
import {
	formatSize,
	getResourceOpenRoute,
} from "@/lib/resources/resource-format";
import {
	AlertTriangle,
	Database,
	FolderOpen,
	Inbox,
	RefreshCcw,
	Search,
	Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

export default function Resources() {
	const { resources, isLoading, isError, error, refetch, removeResource } =
		useCachedResources();
	const [query, setQuery] = useState("");

	const filtered = useMemo(() => {
		const normalized = query.trim().toLowerCase();
		if (normalized.length === 0) return resources;
		return resources.filter((resource) =>
			`${resource.name} ${resource.CourseTitle ?? ""}`
				.toLowerCase()
				.includes(normalized),
		);
	}, [resources, query]);

	const totalSize = useMemo(
		() => resources.reduce((sum, resource) => sum + resource.size, 0),
		[resources],
	);

	return (
		<div className="mx-auto flex w-full max-w-5xl flex-col gap-4 p-4 pb-12 sm:gap-5 sm:p-6 lg:p-8">
			<Helmet>
				<title>Resources</title>
			</Helmet>

			<header className="rounded-xl border bg-card p-5 sm:p-6">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex items-center gap-3">
						<div className="flex h-11 w-11 items-center justify-center rounded-md border bg-background">
							<Database className="h-5 w-5" />
						</div>
						<div>
							<h1 className="text-2xl font-semibold tracking-tight">
								Resources
							</h1>
							<p className="text-sm text-muted-foreground">
								{resources.length} cached file
								{resources.length === 1 ? "" : "s"} · {formatSize(totalSize)}
							</p>
						</div>
					</div>
					<Button asChild variant="outline" size="sm">
						<Link to="/courses">Browse courses</Link>
					</Button>
				</div>
				<div className="relative mt-4">
					<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						value={query}
						onChange={(event) => setQuery(event.target.value)}
						placeholder="Search cached resources..."
						className="pl-9"
					/>
				</div>
			</header>

			<section className="rounded-xl border bg-card">
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
								? "No cached resources yet. Files you open appear here."
								: "No cached resources match your search."}
						</p>
					</div>
				) : (
					<ul className="flex flex-col divide-y">
						{filtered.map((resource) => {
							const route = getResourceOpenRoute(
								resource.name,
								resource.elementId,
							);
							return (
								<li
									key={resource.elementId}
									className="flex items-center gap-3 px-4 py-3"
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
									<Badge
										variant="outline"
										className="hidden shrink-0 font-normal sm:inline-flex"
									>
										Cached
									</Badge>
									<div className="hidden w-20 shrink-0 text-right text-xs text-muted-foreground sm:block">
										{formatSize(resource.size)}
									</div>
									<div className="hidden w-24 shrink-0 text-right text-xs text-muted-foreground md:block">
										{new Intl.DateTimeFormat(undefined, {
											month: "short",
											day: "numeric",
										}).format(resource.last_accessed)}
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
