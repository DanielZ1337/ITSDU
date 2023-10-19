import {Skeleton} from "@/components/ui/skeleton";

export default function LightbulletinsForCourseLoader() {
    return (
        <div className={"my-2 p-2 gap-4 flex flex-col"}>
            {[...Array(4).keys()].map(i => i + 1).map((i) => (
                <div key={i} className="p-4 rounded-md bg-foreground/10 shadow-md hover:shadow-lg overflow-hidden">
                    <div className="flex space-x-4">
                        <div className="flex-1 space-y-4 py-1">
                            <div className="space-y-2">
                                <Skeleton className="h-4 bg-foreground/20 rounded w-3/4"/>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 bg-foreground/20 rounded"/>
                                    <Skeleton className="h-4 bg-foreground/20 rounded w-5/6"/>
                                    <Skeleton className="h-4 bg-foreground/20 rounded w-3/4"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-2 flex justify-between">
                    <span className="text-gray-600 flex gap-2 items-center">
                      Published by {' '}
                        <a
                            href="#"
                            className="text-blue-500 hover:underline"
                        >
                            <Skeleton className="animate-pulse h-4 w-24 bg-foreground/20 rounded"/>
                        </a>{' '}
                        on
                        <Skeleton className="animate-pulse h-4 w-12 bg-foreground/20 rounded"/>
                    </span>
                    </div>
                    <div className="mt-2 flex justify-between">
                    <span className="text-gray-600">
                      0 Comments
                    </span>
                        <span className="text-gray-600">
                        0 Resources
                    </span>
                    </div>
                </div>
            ))}
        </div>
    )
}