import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare, Paperclip } from "lucide-react";

export default function LightbulletinsForCourseLoader() {
	return (
		<div className="flex flex-col gap-4 p-4">
			{[...Array(4).keys()].map((i) => (
				<div
					key={i}
					className="rounded-xl border border-border/40 bg-card/50 overflow-hidden"
				>
					{/* Card Header */}
					<div className="flex items-start justify-between gap-4 p-4 pb-0">
						<div className="flex items-center gap-3">
							<Skeleton className="h-10 w-10 rounded-full" />
							<div className="space-y-2">
								<Skeleton className="h-4 w-32" />
								<Skeleton className="h-3 w-20" />
							</div>
						</div>
						<Skeleton className="h-8 w-8 rounded-full" />
					</div>

					{/* Card Content */}
					<div className="p-4 space-y-2">
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-5/6" />
						<Skeleton className="h-4 w-4/6" />
					</div>

					{/* Card Footer */}
					<div className="flex items-center gap-2 px-4 py-3 border-t border-border/50 bg-muted/20">
						<Skeleton className="h-8 w-24 rounded-md" />
						<Skeleton className="h-8 w-20 rounded-md" />
					</div>
				</div>
			))}
		</div>
	);
}
