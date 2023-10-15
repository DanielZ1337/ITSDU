import React, { useCallback, useEffect } from 'react'
import { CommandDialog, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command'
import { Skeleton } from '../ui/skeleton'
import useGETstarredCourses from '@/queries/course-cards/useGETstarredCourses'
import { useNavigate } from 'react-router-dom'
import { CommandEmpty } from 'cmdk'
import { cn } from '@/lib/utils'
import { useDebounce } from '@uidotdev/usehooks'
import useGETunstarredCourses from '@/queries/course-cards/useGETunstarredCourses'

function CourseCommandList(props: {
    starredFetching: boolean,
    unstarredFetching: boolean,
    starredCourses: any,
    unstarredCourses: any,
    element: (resource) => React.JSX.Element,
    element1: (resource) => React.JSX.Element
}) {
    return <>
        <CommandEmpty
            className={cn(props.starredFetching || props.unstarredFetching ? "hidden" : "py-6 text-center text-sm")}
        >
            No courses found.
        </CommandEmpty>
        {props.starredFetching || props.unstarredFetching ? (
            <div className="space-y-1 overflow-hidden px-1 py-2">
                <Skeleton className="h-4 w-10 rounded" />
                <Skeleton className="h-8 rounded-sm" />
                <Skeleton className="h-8 rounded-sm" />
            </div>
        ) : (
            props.starredCourses && props.unstarredCourses && (
                <div className="overflow-y-auto max-h-[40dvh]">
                    <CommandGroup
                        heading={`${props.starredCourses.EntityArray.length} starred courses founded`}
                    >
                        <div className="my-2 space-y-1 overflow-hidden pr-1">
                            {props.starredCourses.EntityArray.map(props.element)}
                        </div>
                    </CommandGroup>
                    <CommandGroup
                        heading={`${props.unstarredCourses.EntityArray.length} unstarred courses founded`}
                    >
                        <div className="my-2 space-y-1 overflow-hidden pr-1">
                            {props.unstarredCourses.EntityArray.map(props.element1)}
                        </div>
                    </CommandGroup>
                </div>
            )
        )}
    </>;
}

export default function CourseSearchDialog({ searchInput, setSearchInput }: {
    searchInput: string
    setSearchInput: (value: string) => void
}) {
    const [isOpen, setIsOpen] = React.useState(false)
    const navigate = useNavigate()
    const [query, setQuery] = React.useState<string>("")
    const debouncedSearchTerm = useDebounce(query, 200);

    const { data: starredCourses, isLoading: isStarredFetching } = useGETstarredCourses({
        PageIndex: 0,
        PageSize: 9999,
        searchText: debouncedSearchTerm,
        sortBy: "Rank",
    }, {
        keepPreviousData: true
    })

    const { data: unstarredCourses, isLoading: isUnstarredFetching } = useGETunstarredCourses({
        PageIndex: 0,
        PageSize: 9999,
        searchText: debouncedSearchTerm,
        sortBy: "Rank",
    }, {
        keepPreviousData: true
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
            setSearchInput("")
        }
    }, [isOpen, setSearchInput])

    return (
        <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
            <CommandInput
                placeholder="Search resources..."
                value={query}
                onValueChange={setQuery}
            // className={"border-"}
            />
            <div className='overflow-hidden max-h-[50dvh]'>
                <CommandList>
                    <CourseCommandList starredFetching={isStarredFetching} unstarredFetching={isUnstarredFetching}
                        starredCourses={starredCourses} unstarredCourses={unstarredCourses}
                        element={(resource) => (
                            <CommandItem
                                key={resource.CourseId}
                                value={resource.Title}
                                className="line-clamp-1 break-all truncate"
                                onSelect={() => handleSelect(() => {
                                    console.log("Selected resource", resource)
                                    navigate(`/course/${resource.CourseId}`)
                                })}
                            >
                                <span>{resource.Title}</span>
                            </CommandItem>
                        )} element1={(resource) => (
                            <CommandItem
                                key={resource.CourseId}
                                value={resource.Title}
                                className="line-clamp-1 break-all truncate"

                                onSelect={() => handleSelect(() => {
                                    console.log("Selected resource", resource)
                                    navigate(`/course/${resource.CourseId}`)
                                })}
                            >
                                <span>{resource.Title}</span>
                            </CommandItem>
                        )} />
                </CommandList>
            </div>
        </CommandDialog>
    )
}
