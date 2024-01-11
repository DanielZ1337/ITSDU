import { Suspense, useRef, useState } from "react";
import LightbulletinsForCourseLoader from "@/components/lightbulletin/lightbulletins-for-course-loader.tsx";
import LightbulletinsForCourse from "@/components/lightbulletin/lightbulletins-for-course.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import Resources from "@/components/resources/resources.tsx";
import { useParams } from "react-router-dom";
import { Bell, Files } from "lucide-react";
import '@/styles/splitter-custom.css'
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ImperativePanelHandle } from "react-resizable-panels";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export default function CourseIndex() {
    const { id } = useParams();
    const courseId = Number(id);
    const [longPress, setLongPress] = useState(false);
    const [openTooltip, setOpenTooltip] = useState(false);

    const ref = useRef<ImperativePanelHandle>(null);

    const handleMouseDown = () => {
        // Set a timeout to detect long press
        const timeoutId = setTimeout(() => {
            setLongPress(true);
        }, 200); // Adjust the timeout duration as needed

        // Clear the timeout on mouseup or mouseleave
        const clearLongPress = () => {
            clearTimeout(timeoutId);
            setLongPress(false);
            document.removeEventListener("touchend", clearLongPress);
            document.removeEventListener("touchcancel", clearLongPress);
            document.removeEventListener("mouseup", clearLongPress);
        };

        document.addEventListener("mouseup", clearLongPress);
        document.addEventListener("touchend", clearLongPress);
        document.addEventListener("touchcancel", clearLongPress);
    };

    const handleClick = () => {
        if (!longPress) {
            const panel = ref.current;
            if (panel) {
                const isCollapsed = panel.isCollapsed();
                if (isCollapsed) {
                    panel.expand();
                } else {
                    panel.collapse();
                }
            }
        }
    }

    return (
        <div className="grid h-full items-start gap-6 text-sm font-medium">
            <div className={"flex gap-4 h-full"}>
                <ResizablePanelGroup autoSaveId={"course-index"} direction="horizontal">
                    <ResizablePanel minSize={0} defaultSize={70}>
                        <div className={"flex flex-col flex-1 py-4 pl-4 pr-2"}>
                            <div className={"flex flex-col flex-1 gap-4"}>
                                <div className="flex justify-between">
                                    <h2 className={"text-xl font-bold items-center gap-4 inline-flex"}>
                                        <Bell /> Announcements
                                    </h2>
                                </div>
                                <Suspense fallback={<LightbulletinsForCourseLoader />}>
                                    <LightbulletinsForCourse courseId={courseId} />
                                </Suspense>
                            </div>
                        </div>
                    </ResizablePanel>
                    <TooltipProvider disableHoverableContent delayDuration={0}>
                        <Tooltip onOpenChange={setOpenTooltip} open={openTooltip && !longPress}>
                            <TooltipTrigger asChild>
                                <div onMouseUp={handleClick} onMouseDown={handleMouseDown} onTouchStart={handleMouseDown} className="py-40 hover:py-20 active:py-0 transition-all duration-1000 ease-in-out">
                                    <ResizableHandle withHandle
                                        className="rounded-full hover:rounded-full active:rounded-none w-4 bg-border/0 group hover:bg-border/70 active:bg-border transition-all duration-200 ease-in-out"
                                        handleClassName="h-16 w-3 bg-border/35 group-hover:bg-border/70 active:bg-border transition-all duration-200 ease-in-out border border-border/50"
                                    >
                                        <div className="h-7 w-1 bg-white/50 rounded-full group-hover:bg-white/70 group-active:bg-white transition-all duration-200 ease-in-out" />
                                    </ResizableHandle>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent side="left">
                                <p className="text-sm text-white">Drag to resize</p>
                                <p className="text-sm text-white">Click to {ref.current?.isCollapsed() ? "expand" : "collapse"}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <ResizablePanel ref={ref} collapsible minSize={5} className={cn(!longPress && "transition-all")}>
                        <div
                            className={"flex flex-col gap-4 pl-4 py-4 pr-4"}>
                            <h2 className={"text-xl font-bold inline-flex gap-4 shrink-0"}><Files className="shrink-0" /> Resources</h2>
                            <Suspense
                                fallback={<div className={"flex flex-col gap-2 w-full"}>
                                    <Skeleton className="h-4 rounded bg-foreground/20" />
                                    <Skeleton className="h-4 rounded bg-foreground/20" />
                                    <Skeleton className="h-4 rounded bg-foreground/20" />
                                    <Skeleton className="h-4 rounded bg-foreground/20" />
                                </div>}>
                                <Resources courseId={courseId} />
                            </Suspense>
                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup >
            </div >
        </div >
    )
}