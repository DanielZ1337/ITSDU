import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Skeleton } from "@nextui-org/react";
import { Star } from "lucide-react";

export default function CourseHeaderFallback() {
    return (
        <header
            className="sticky top-0 z-10 flex w-full items-center gap-4 border-b bg-zinc-100/40 px-6 shadow h-[60px] dark:bg-zinc-800/40">
            <div className="flex w-full flex-1 justify-between">
                <div className={"flex flex-row items-center gap-2"}>
                    <Button variant={"ghost"} size={"icon"} className={cn("shrink-0 hover:bg-yellow-400/10")}>
                        {/* <Star
                            className={cn("w-6 h-6 dark:text-yellow-400 text-yellow-600 shrink-0 fill-yellow-600 dark:fill-yellow-400")}/> */}
                    </Button>
                    {/* course title */}
                    <Skeleton className="h-7 w-96 rounded-md" />
                </div>
                <span className="my-auto ml-6 text-sm text-gray-500 text-nowrap dark:text-gray-400">
                    {/* course code */}
                    <Skeleton className="h-5 w-32 rounded-md" />
                </span>
            </div>
        </header>
    )
}