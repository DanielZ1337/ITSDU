import {Skeleton} from "@/components/ui/skeleton";
import {Badge} from "../ui/badge";
import {BsChatSquareTextFill, BsFileEarmarkFill} from "react-icons/bs";

export default function LightbulletinsForCourseLoader() {
    return (
        <div className={"gap-4 flex flex-col"}>
            {[...Array(4).keys()].map(i => i + 1).map((i) => (
                <div key={i} className="p-4 rounded-md bg-foreground/10 shadow-md hover:shadow-lg overflow-hidden">
                    <div className="flex items-center space-x-2">
                        <Skeleton className="shrink-0 w-10 h-10 bg-foreground/10 rounded-full"/>
                        <Skeleton className="h-6 bg-foreground/20 rounded w-2/4"/>
                    </div>
                    <div className="flex space-x-4 mt-2 py-4">
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
                    <div className="mt-2 flex gap-4 truncate text-lg">
                        <Skeleton>
                            <Badge
                                variant={"outline"}
                                className={"hover:bg-secondary-200 gap-2 px-4 py-1 text-sm"}>
                                0
                                <BsChatSquareTextFill className={"mt-1"}/>
                            </Badge>
                        </Skeleton>
                        <Skeleton>
                            <Badge
                                variant={"outline"}
                                className={"hover:bg-secondary-200 gap-2 px-4 py-1 text-sm"}>
                                0
                                <BsFileEarmarkFill/>
                            </Badge>
                        </Skeleton>
                    </div>
                </div>
            ))}
        </div>
    )
}