import {Search} from "lucide-react";
import {Button} from "@/components/ui/button";
import {cn, isMacOS} from "@/lib/utils";
import {Skeleton} from "@/components/ui/skeleton";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from "@/components/ui/command";
import {useDebounce} from "@uidotdev/usehooks";
import {useCallback, useEffect, useState} from "react";
import useGETcourseResourceBySearch from "@/queries/courses/useGETcourseResourceBySearch.ts";
import {
    ItsolutionsItslUtilsConstantsLocationType
} from "@/types/api-types/utils/Itsolutions.ItslUtils.Constants.LocationType.ts";

export default function SearchResourcesDialog({courseId}: {
    courseId: number
}) {
    const [isOpen, setIsOpen] = useState(false)
    const [query, setQuery] = useState("")
    const debouncedQuery = useDebounce(query, 300)

    const {data: resources, isLoading, isFetching} = useGETcourseResourceBySearch({
        searchText: debouncedQuery,
        locationId: courseId,
        locationType: ItsolutionsItslUtilsConstantsLocationType.Course,
    }, {
        suspense: true,
        enabled: debouncedQuery.length > 0,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    })

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setIsOpen((isOpen) => !isOpen)
            }
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [])

    const handleSelect = useCallback((callback: () => unknown) => {
        setIsOpen(false)
        callback()
    }, [])

    useEffect(() => {
        if (!isOpen) {
            setQuery("")
        }
    }, [isOpen])

    return (
        <>
            <Button
                size={"sm"}
                className="h-9 border-0 lg:border-1 lg:py-2 lg:pr-12 lg:w-40 xl:w-52 inline-flex items-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground relative justify-start text-sm text-muted-foreground"
                onClick={() => setIsOpen(true)}
            >
                <Search className={"h-4 w-4 lg:mr-2 shrink-0 lg:-ml-0.5"}/>
                <span className="hidden xl:inline-flex">Search resources...</span>
                <span
                    className="hidden lg:inline-flex xl:hidden">Search...</span>
                <kbd
                    className="pointer-events-none absolute right-2 my-auto hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 lg:flex">
                    <span>
                        {isMacOS() ? "⌘" : "Ctrl"}
                    </span>
                    K
                </kbd>
                <span className="sr-only">Search products</span>
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
                        <div className="space-y-1 overflow-hidden px-1 py-2">
                            <Skeleton className="h-4 w-10 rounded"/>
                            <Skeleton className="h-8 rounded-sm"/>
                            <Skeleton className="h-8 rounded-sm"/>
                        </div>
                    ) : (
                        resources && (
                            <CommandGroup
                                heading={`${resources?.Resources.EntityArray.length
                                } resources found`}
                            >
                                <div className="my-2 space-y-1 overflow-hidden pr-1 overflow-y-auto max-h-[40dvh]">
                                    {resources!.Resources.EntityArray.map((resource) => (
                                        <CommandItem
                                            key={resource.ElementId}
                                            className="line-clamp-1 break-all truncate"
                                            onSelect={() => handleSelect(() => {
                                                console.log("Selected resource", resource)
                                                window.app.openExternal(resource.ContentUrl, true)
                                            })}
                                        >
                                            {resource.Title}
                                        </CommandItem>
                                    ))}
                                </div>
                            </CommandGroup>
                        )
                    )}
                </CommandList>
            </CommandDialog>
        </>
    )
}