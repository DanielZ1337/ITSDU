import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {Skeleton} from "@nextui-org/react";
import {Star} from "lucide-react";

export default function CourseHeaderFallback() {
    return (
        <header
            className="w-full sticky top-0 flex h-[60px] items-center gap-4 border-b bg-zinc-100/40 px-6 dark:bg-zinc-800/40 shadow z-10">
            <div className="w-full flex-1 flex justify-between">
                <div className={"flex flex-row items-center gap-2"}>
                    <Button variant={"ghost"} size={"icon"} className={cn("shrink-0 hover:bg-yellow-400/10")}>
                        <Star
                            className={cn("w-6 h-6 dark:text-yellow-400 text-yellow-600 shrink-0 fill-yellow-600 dark:fill-yellow-400")}/>
                    </Button>
                    {/* course title */}
                    <Skeleton className="w-96 h-7 rounded-md"/>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400 text-nowrap my-auto ml-6">
                    {/* course code */}
                    <Skeleton className="w-32 h-5 rounded-md"/>
                </span>
            </div>
        </header>
    )
}