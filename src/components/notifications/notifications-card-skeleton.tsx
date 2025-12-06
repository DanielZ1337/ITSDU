import { Skeleton } from "@/components/ui/skeleton";

export function NotificationsCardSkeleton() {
	return (
		<div className="rounded-xl border border-border/50 bg-card/50 p-4">
			<div className="flex items-start gap-3">
				{/* Icon skeleton with gradient-like effect */}
				<Skeleton className="h-11 w-11 rounded-xl flex-shrink-0" />
				{/* Content skeleton */}
				<div className="flex-1 min-w-0 space-y-2">
					<Skeleton className="h-5 w-3/4" />
					<Skeleton className="h-4 w-24" />
				</div>
			</div>
		</div>
	);
}
