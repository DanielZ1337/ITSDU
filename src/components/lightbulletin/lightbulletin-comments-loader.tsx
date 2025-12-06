import { Skeleton } from "@/components/ui/skeleton";

export default function LightbulletinCommentsLoader({
    count = 3,
}: {
    count?: number;
}) {
    return (
        <div className="space-y-3">
            {[...Array(Math.min(count, 5)).keys()].map((i) => (
                <div key={i} className="flex gap-3 p-2">
                    {/* Avatar */}
                    <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />

                    {/* Content */}
                    <div className="flex-1 space-y-2">
                        {/* Name and time */}
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-3.5 w-24" />
                            <Skeleton className="h-3 w-16" />
                        </div>
                        {/* Comment text */}
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                </div>
            ))}
        </div>
    );
}
