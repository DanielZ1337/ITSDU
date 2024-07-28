import { DownloadIcon, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, isMacOS } from "@/lib/utils";
import { isResourceFile } from "@/types/api-types/extra/learning-tool-id-types";
import { Skeleton } from "@/components/ui/skeleton";
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { useDebounce } from "@uidotdev/usehooks";
import { useCallback, useEffect, useState } from "react";
import useGETcourseResourceBySearch from "@/queries/courses/useGETcourseResourceBySearch.ts";
import { ItsolutionsItslUtilsConstantsLocationType } from "@/types/api-types/utils/Itsolutions.ItslUtils.Constants.LocationType.ts";
import { useSidebar } from "@/hooks/atoms/useSidebar";
import { useDownloadToast } from "../recursive-file-explorer";

export default function SearchResourcesDialog({
	courseId,
}: { courseId: number }) {
	const [isOpen, setIsOpen] = useState(false);
	const [query, setQuery] = useState("");
	const debouncedQuery = useDebounce(query, 300);
	const { setSidebarActive, sidebarActive } = useSidebar();

	const { data: resources, isFetching } = useGETcourseResourceBySearch(
		{
			searchText: debouncedQuery,
			locationId: courseId,
			locationType: ItsolutionsItslUtilsConstantsLocationType.Course,
		},
		{
			enabled: debouncedQuery.length > 2,
			refetchOnWindowFocus: false,
			refetchOnReconnect: false,
		},
	);

	function isFile(filename: string): boolean {
		const regex = /\.(pdf|docx?|xlsx?|pptx?|txt|csv|zip|rar)$/i;
		return regex.test(filename);
	}

	const { downloadToast } = useDownloadToast();

	useEffect(() => {
		const handleDownloadShortcut = (e: KeyboardEvent) => {
			if (e.key === "d" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				const selected = document.querySelector(
					'[aria-selected="true"]',
				) as HTMLDivElement | null;
				if (selected) {
					const elementId = Number(selected.dataset.elementid);
					const resource = resources?.Resources.EntityArray.find(
						(resource) => resource.ElementId === elementId,
					);
					if (resource) {
						if (isResourceFile(resource)) {
							downloadToast(resource);
							// toast({
							//     title: 'Downloading...',
							//     description: resource.Title,
							//     duration: 3000,
							// })
							// window.download.start(resource.ElementId, resource.Title)
							// window.ipcRenderer.once('download:complete', (_, args) => {
							//     console.log(args)
							//     toast({
							//         title: 'Downloaded',
							//         description: resource.Title,
							//         duration: 3000,
							//         variant: 'success',
							//         onMouseDown: async () => {
							//             // if the user clicks on the toast, open the file
							//             // get the time that the mouse was pressed
							//             const mouseDownTime = new Date().getTime()
							//             // wait for the mouse to be released
							//             await new Promise<void>((resolve) => {
							//                 window.addEventListener('mouseup', () => {
							//                     resolve()
							//                 }, {once: true})
							//             })
							//             // if the mouse was pressed for less than 500ms, open the file
							//             if (new Date().getTime() - mouseDownTime < 100) {
							//                 console.log("Opening shell")
							//                 await window.app.openShell(args)
							//                 dismiss()
							//             } else {
							//                 console.log("Not opening shell")
							//             }
							//         },
							//     })
							// })
							// window.ipcRenderer.once('download:error', (_, args) => {
							//     console.log(args)
							//     toast({
							//         title: 'Download error',
							//         description: resource.Title,
							//         duration: 3000,
							//         variant: 'destructive'
							//     })
							// })
						}
					}
				}
			}
		};

		window.addEventListener("keydown", handleDownloadShortcut);

		return () => {
			window.removeEventListener("keydown", handleDownloadShortcut);
		};
	}, [resources]);
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setIsOpen((isOpen) => !isOpen);
				setSidebarActive(false);
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	const handleSelect = useCallback((callback: () => unknown) => {
		setIsOpen(false);
		callback();
	}, []);

	useEffect(() => {
		if (!isOpen) {
			setQuery("");
		}
	}, [isOpen]);

	return (
		<>
			<Button
				size={"sm"}
				className={cn(
					"h-9 border-0 inline-flex items-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground relative justify-start text-sm text-muted-foreground",
					sidebarActive
						? "lg:border-1 lg:py-2 lg:pr-12 lg:w-40 xl:w-52 justify-start"
						: "w-full mx-auto justify-center",
				)}
				onClick={() => {
					setIsOpen(true);
					setSidebarActive(false);
				}}
			>
				<Search className={"h-4 w-4 lg:mr-2 shrink-0 lg:-ml-0.5"} />
				{sidebarActive && (
					<>
						<span className="hidden xl:inline-flex">Search resources...</span>
						<span className="hidden lg:inline-flex xl:hidden">Search...</span>
						<kbd className="pointer-events-none absolute right-2 my-auto hidden h-5 select-none items-center gap-1 rounded border font-mono font-medium opacity-100 bg-muted px-1.5 text-[10px] lg:flex">
							<span>{isMacOS() ? "⌘" : "Ctrl"}</span>K
						</kbd>
					</>
				)}
				<span className="sr-only">Search resources</span>
			</Button>
			<CommandDialog open={isOpen} onOpenChange={setIsOpen}>
				<CommandInput
					placeholder="Search resources..."
					value={query}
					onValueChange={setQuery}
					// className={"border-"}
				/>
				<CommandList className={"overflow-hidden max-h-[50dvh]"}>
					<CommandEmpty
						className={cn(isFetching ? "hidden" : "py-6 text-center text-sm")}
					>
						No resources found.
					</CommandEmpty>
					{isFetching ? (
						<div className="overflow-hidden px-1 py-2 space-y-1">
							<Skeleton className="h-4 w-10 rounded" />
							<Skeleton className="h-8 rounded-sm" />
							<Skeleton className="h-8 rounded-sm" />
						</div>
					) : (
						resources && (
							<CommandGroup
								heading={`${resources?.Resources.EntityArray.length} resources found`}
							>
								<div className="my-2 overflow-hidden overflow-y-auto pr-1 space-y-1 max-h-[40dvh]">
									{resources!.Resources.EntityArray.map((resource) => (
										<CommandItem
											data-elementid={resource.ElementId}
											key={resource.ElementId}
											value={resource.Title}
											className="flex items-center justify-between"
											onSelect={() =>
												handleSelect(() => {
													console.log("Selected resource", resource);
													window.app.openExternal(resource.ContentUrl, true);
												})
											}
										>
											<span className="truncate break-all line-clamp-1">
												{resource.Title}
											</span>
											<div className="flex">
												{isResourceFile(resource) && (
													<Button
														variant={"outline"}
														size={"icon"}
														onClick={(e) => {
															e.stopPropagation();
															downloadToast(resource);
														}}
													>
														<DownloadIcon className={"w-6 h-6"} />
													</Button>
												)}
												<div className="ml-4 flex h-fit w-fit transform cursor-pointer justify-end rounded-full p-2 transition-all duration-200 ease-in-out bg-background/30 hover:opacity-80 hover:shadow-md active:scale-95 active:opacity-60 md:ml-6 lg:ml-8 xl:ml-10">
													<img
														loading="lazy"
														src={resource.IconUrl}
														alt={resource.Title}
														className={"w-6 h-6"}
													/>
												</div>
											</div>
										</CommandItem>
									))}
								</div>
							</CommandGroup>
						)
					)}
				</CommandList>
			</CommandDialog>
		</>
	);
}
