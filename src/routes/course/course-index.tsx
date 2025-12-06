import LightbulletinsForCourseLoader from "@/components/lightbulletin/lightbulletins-for-course-loader.tsx";
import LightbulletinsForCourse from "@/components/lightbulletin/lightbulletins-for-course.tsx";
import Resources from "@/components/resources/resources.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Bell, Files, PanelRightClose, PanelRightOpen, Search, X } from "lucide-react";
import { Suspense, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import "@/styles/splitter-custom.css";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	SearchInput,
	SearchProvider,
	useSearch,
} from "@/components/ui/search-input";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { ImperativePanelHandle } from "react-resizable-panels";

export default function CourseIndex() {
	const { id } = useParams();
	const courseId = Number(id);
	const [longPress, setLongPress] = useState(false);
	const [openTooltip, setOpenTooltip] = useState(false);
	const [isMounted, setIsMounted] = useState(false);
	const [isResourcesPanelCollapsed, setIsResourcesPanelCollapsed] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const ref = useRef<ImperativePanelHandle>(null);

	const handleMouseDown = () => {
		const timeoutId = setTimeout(() => {
			setLongPress(true);
		}, 100);

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
					setIsResourcesPanelCollapsed(false);
				} else {
					panel.collapse();
					setIsResourcesPanelCollapsed(true);
				}
			}
		}
	};

	const toggleResourcesPanel = () => {
		const panel = ref.current;
		if (panel) {
			const isCollapsed = panel.isCollapsed();
			if (isCollapsed) {
				panel.expand();
				setIsResourcesPanelCollapsed(false);
			} else {
				panel.collapse();
				setIsResourcesPanelCollapsed(true);
			}
		}
	};

	return (
		<div className="flex flex-col flex-1 h-full max-h-full overflow-hidden">
			{/* Unified Header */}
			<div className="flex-shrink-0 border-b border-border/50 bg-background">
				<div className="flex items-center justify-between px-6 py-3">
					<div className="flex items-center gap-3">
						<div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10">
							<Bell className="w-4 h-4 text-primary" />
						</div>
						<div>
							<h1 className="text-lg font-semibold text-foreground tracking-tight">
								Announcements
							</h1>
						</div>
					</div>

					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="outline"
									size="sm"
									onClick={toggleResourcesPanel}
									className="h-8 gap-2"
								>
									<Files className="w-4 h-4" />
									<span className="hidden sm:inline">Resources</span>
									{isResourcesPanelCollapsed ? (
										<PanelRightOpen className="w-3.5 h-3.5 text-muted-foreground" />
									) : (
										<PanelRightClose className="w-3.5 h-3.5 text-muted-foreground" />
									)}
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								{isResourcesPanelCollapsed ? "Show Resources Panel" : "Hide Resources Panel"}
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
			</div>

			{/* Content Area with Resizable Panels */}
			<ResizablePanelGroup autoSaveId="course-index" direction="horizontal" className="flex-1">
				{/* Announcements Panel */}
				<ResizablePanel
					minSize={30}
					defaultSize={65}
					className="overflow-hidden"
				>
					<ScrollArea className="h-full">
						<div className="p-4">
							<Suspense fallback={<LightbulletinsForCourseLoader />}>
								<LightbulletinsForCourse courseId={courseId} />
							</Suspense>
						</div>
					</ScrollArea>
				</ResizablePanel>

				{/* Resizable Handle */}
				<TooltipProvider disableHoverableContent delayDuration={0}>
					<Tooltip
						onOpenChange={setOpenTooltip}
						open={openTooltip && !longPress}
					>
						<TooltipTrigger asChild>
							<button
								type="button"
								onMouseUp={handleClick}
								onMouseDown={handleMouseDown}
								onTouchStart={handleMouseDown}
								className="py-40 hover:py-20 active:py-0 transition-all duration-1000 ease-in-out group"
							>
								<ResizableHandle
									withHandle
									className="w-2.5 bg-border/40 group-hover:bg-primary/50 group-active:bg-primary/70 transition-colors duration-200  rounded-full"
									handleClassName="h-14 w-1.5 border-0 bg-border/60 group-hover:bg-primary group-active:bg-primary transition-colors duration-200 rounded-full"
								>
									<div className="h-6 w-1 bg-muted-foreground/50 rounded-full group-hover:bg-primary-foreground group-active:bg-primary-foreground transition-colors duration-200" />
								</ResizableHandle>
							</button>
						</TooltipTrigger>
						<TooltipContent side="left">
							<p className="text-sm">Drag to resize</p>
							<p className="text-sm">
								Click to {isResourcesPanelCollapsed ? "expand" : "collapse"}
							</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>

				{/* Resources Panel */}
				<ResizablePanel
					ref={ref}
					collapsible
					minSize={20}
					defaultSize={35}
					onCollapse={() => setIsResourcesPanelCollapsed(true)}
					onExpand={() => setIsResourcesPanelCollapsed(false)}
				>
					{isMounted && (
						<SearchProvider>
							<ResourcesPanel courseId={courseId} />
						</SearchProvider>
					)}
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
}

function ResourcesPanel({
	courseId,
	shouldAutoSearch = true,
}: { courseId: number; shouldAutoSearch?: boolean }) {
	const inputs = document.querySelectorAll("input");
	const isInputFocused = Array.from(inputs).some(
		(input) => input === document.activeElement,
	);

	const { value, handleChange, clearValue } = useSearch();

	return (
		<div className="flex flex-col h-full max-h-full overflow-hidden border-l border-border/50 bg-muted/30">
			{/* Resources Header with Search */}
			<div className="flex-shrink-0 p-3 border-b border-border/30">
				<div className="relative">
					<Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
					<SearchInput
						autoFocus={!isInputFocused && shouldAutoSearch}
						className="font-normal pl-8 pr-8 h-8 text-sm bg-background/60 border-border/50"
						value={value}
						onChange={handleChange}
						type="search"
						placeholder="Search files..."
					/>
					{value && (
						<Button
							variant="ghost"
							size="icon"
							onClick={clearValue}
							className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 hover:bg-transparent"
						>
							<X className="w-3 h-3 text-muted-foreground" />
						</Button>
					)}
				</div>
			</div>

			{/* Resources Content */}
			<Suspense
				fallback={
					<div className="flex flex-col gap-2 p-3">
						<ResourcesSkeleton />
					</div>
				}
			>
				<ScrollArea className="flex-1">
					<div className="p-3">
						<Resources courseId={courseId} />
					</div>
				</ScrollArea>
			</Suspense>
		</div>
	);
}

function ResourcesSkeleton() {
	return (
		<div className="space-y-2 p-2">
			{Array.from({ length: 10 }).map((_, i) => (
				<div key={i} className="flex items-center gap-2">
					<Skeleton className="h-6 w-6 rounded flex-shrink-0 bg-foreground/20" />
					<Skeleton
						className="h-6 rounded bg-foreground/20"
						style={{ width: `${60 + (i % 3) * 15}%` }}
					/>
				</div>
			))}
		</div>
	);
}
