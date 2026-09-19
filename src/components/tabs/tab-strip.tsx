import { Copy, Plus, RotateCcw, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { cn } from "@/lib/utils";
import { useTabs } from "./tab-manager";

export default function TabStrip() {
	const {
		tabs,
		activeTabId,
		switchTab,
		openTab,
		closeTab,
		duplicateTab,
		closeOtherTabs,
		closeTabsToRight,
		moveTab,
		reopenClosedTab,
	} = useTabs();
	const [draggedId, setDraggedId] = useState<string>();
	const activeRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		activeRef.current?.scrollIntoView({
			behavior: "smooth",
			block: "nearest",
			inline: "nearest",
		});
	}, [activeTabId]);

	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			const command = event.ctrlKey || event.metaKey;
			if (!command) return;
			if (event.key.toLowerCase() === "t" && !event.shiftKey) {
				event.preventDefault();
				openTab("/");
			} else if (event.key.toLowerCase() === "w") {
				event.preventDefault();
				closeTab(activeTabId);
			} else if (event.key.toLowerCase() === "t" && event.shiftKey) {
				event.preventDefault();
				reopenClosedTab();
			} else if (event.key === "Tab") {
				event.preventDefault();
				const index = tabs.findIndex((tab) => tab.id === activeTabId);
				const direction = event.shiftKey ? -1 : 1;
				const next = (index + direction + tabs.length) % tabs.length;
				switchTab(tabs[next].id);
			} else if (/^[1-9]$/.test(event.key)) {
				const requested = Number(event.key) - 1;
				const index = requested === 8 ? tabs.length - 1 : requested;
				if (tabs[index]) {
					event.preventDefault();
					switchTab(tabs[index].id);
				}
			}
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [activeTabId, closeTab, openTab, reopenClosedTab, switchTab, tabs]);

	return (
		<div className="no-drag flex h-10 shrink-0 items-end border-b bg-muted/25 px-2">
			<div className="scrollbar-hide flex min-w-0 flex-1 items-end gap-1 overflow-x-auto">
				{tabs.map((tab, index) => {
					const active = tab.id === activeTabId;
					return (
						<ContextMenu key={tab.id}>
							<ContextMenuTrigger asChild>
								<div
									ref={active ? activeRef : undefined}
									role="tab"
									tabIndex={active ? 0 : -1}
									aria-selected={active}
									draggable
									onDragStart={(event) => {
										setDraggedId(tab.id);
										event.dataTransfer.effectAllowed = "move";
									}}
									onDragOver={(event) => event.preventDefault()}
									onDrop={(event) => {
										event.preventDefault();
										if (draggedId && draggedId !== tab.id)
											moveTab(draggedId, index);
										setDraggedId(undefined);
									}}
									onClick={() => switchTab(tab.id)}
									onKeyDown={(event) => {
										if (event.key === "Enter" || event.key === " ")
											switchTab(tab.id);
									}}
									onAuxClick={(event) => event.button === 1 && closeTab(tab.id)}
									className={cn(
										"group relative flex h-9 min-w-32 max-w-56 items-center gap-2 rounded-t-md border border-b-0 px-3 text-sm transition-colors",
										active
											? "bg-background text-foreground shadow-sm"
											: "border-transparent text-muted-foreground hover:bg-background/60 hover:text-foreground",
										draggedId === tab.id && "opacity-50",
									)}
									title={tab.title}
								>
									<span className="min-w-0 flex-1 truncate text-left">
										{tab.title}
									</span>
									<button
										type="button"
										aria-label={`Close ${tab.title}`}
										className="rounded-sm p-0.5 opacity-0 hover:bg-foreground/10 group-hover:opacity-100 group-focus-visible:opacity-100"
										onClick={(event) => {
											event.stopPropagation();
											closeTab(tab.id);
										}}
										onKeyDown={(event) => {
											if (event.key === "Enter" || event.key === " ")
												closeTab(tab.id);
										}}
									>
										<X className="h-3.5 w-3.5" />
									</button>
									{active && (
										<span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-primary" />
									)}
								</div>
							</ContextMenuTrigger>
							<ContextMenuContent>
								<ContextMenuItem onSelect={() => duplicateTab(tab.id)}>
									<Copy className="mr-2 h-4 w-4" /> Duplicate tab
								</ContextMenuItem>
								<ContextMenuItem onSelect={reopenClosedTab}>
									<RotateCcw className="mr-2 h-4 w-4" /> Reopen closed tab
								</ContextMenuItem>
								<ContextMenuSeparator />
								<ContextMenuItem onSelect={() => closeTab(tab.id)}>
									Close
								</ContextMenuItem>
								<ContextMenuItem
									disabled={tabs.length === 1}
									onSelect={() => closeOtherTabs(tab.id)}
								>
									Close other tabs
								</ContextMenuItem>
								<ContextMenuItem
									disabled={index === tabs.length - 1}
									onSelect={() => closeTabsToRight(tab.id)}
								>
									Close tabs to the right
								</ContextMenuItem>
							</ContextMenuContent>
						</ContextMenu>
					);
				})}
			</div>
			<button
				type="button"
				className="mb-1 ml-1 rounded-md p-2 text-muted-foreground hover:bg-foreground/8 hover:text-foreground"
				onClick={() => openTab("/")}
				title="New tab (Ctrl+T)"
			>
				<Plus className="h-4 w-4" />
			</button>
		</div>
	);
}
