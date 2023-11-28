import React, { useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { DownloadIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from '@/components/ui/command'
import { useDebounce } from '@uidotdev/usehooks'
import { useToast } from '../ui/use-toast'
import useGETcourseResourceBySearch from '@/queries/courses/useGETcourseResourceBySearch'
import { useCourse } from '@/hooks/atoms/useCourse'
import {
    ItsolutionsItslUtilsConstantsLocationType
} from '@/types/api-types/utils/Itsolutions.ItslUtils.Constants.LocationType'
import { isResourceFile, useNavigateToResource } from '@/types/api-types/extra/learning-tool-id-types'
import { useNavigate } from 'react-router-dom'
import useGETstarredCourses from '@/queries/course-cards/useGETstarredCourses'
import useGETunstarredCourses from '@/queries/course-cards/useGETunstarredCourses'
import { isSupportedResourceInApp } from '../../types/api-types/extra/learning-tool-id-types';
import TitlebarButton from './titlebar-button'

export default function TitlebarSearch() {
    const [isOpen, setIsOpen] = React.useState(false)
    const [query, setQuery] = React.useState("")
    const debouncedQuery = useDebounce(query, 300)
    const { toast, dismiss } = useToast()
    const { courseId } = useCourse()
    const navigate = useNavigate()
    const navigateToResource = useNavigateToResource(navigate)

    const { data: resources, isFetching: isResourcesFetching } = useGETcourseResourceBySearch({
        searchText: debouncedQuery,
        locationId: courseId || 0,
        locationType: ItsolutionsItslUtilsConstantsLocationType.Course,
    }, {
        enabled: debouncedQuery.length > 2 && courseId !== undefined,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    })

    const { data: starredCourses, isLoading: isStarredFetching } = useGETstarredCourses({
        PageIndex: 0,
        PageSize: 9999,
        searchText: debouncedQuery,
        sortBy: "Rank",
    }, {
        suspense: false,
        keepPreviousData: true
    })

    const { data: unstarredCourses, isLoading: isUnstarredFetching } = useGETunstarredCourses({
        PageIndex: 0,
        PageSize: 9999,
        searchText: debouncedQuery,
        sortBy: "Rank",
    }, {
        suspense: false,
        keepPreviousData: true
    })

    useEffect(() => {
        const handleDownloadShortcut = (e: KeyboardEvent) => {
            if (e.key === "d" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                const selected = document.querySelector('[aria-selected="true"]') as HTMLDivElement | null
                if (selected) {
                    const elementId = Number(selected.dataset.elementid)
                    const resource = resources?.Resources.EntityArray.find((resource) => resource.ElementId === elementId)
                    if (resource) {
                        if (isResourceFile(resource)) {
                            toast({
                                title: 'Downloading...',
                                description: resource.Title,
                                duration: 3000,
                            })
                            window.download.start(resource.ElementId, resource.Title)
                            window.ipcRenderer.once('download:complete', (_, args) => {
                                console.log(args)
                                toast({
                                    title: 'Downloaded',
                                    description: resource.Title,
                                    duration: 3000,
                                    variant: 'success',
                                    onMouseDown: async () => {
                                        // if the user clicks on the toast, open the file
                                        // get the time that the mouse was pressed
                                        const mouseDownTime = new Date().getTime()
                                        // wait for the mouse to be released
                                        await new Promise<void>((resolve) => {
                                            window.addEventListener('mouseup', () => {
                                                resolve()
                                            }, { once: true })
                                        })

                                        // if the mouse was pressed for less than 500ms, open the file
                                        if (new Date().getTime() - mouseDownTime < 100) {
                                            console.log("Opening shell")
                                            await window.app.openShell(args)
                                            dismiss()
                                        } else {
                                            console.log("Not opening shell")
                                        }
                                    },
                                })
                            })
                            window.ipcRenderer.once('download:error', (_, args) => {
                                console.log(args)
                                toast({
                                    title: 'Download error',
                                    description: resource.Title,
                                    duration: 3000,
                                    variant: 'destructive'
                                })
                            })
                        }
                    }
                }
            }
        }

        window.addEventListener("keydown", handleDownloadShortcut)

        return () => {
            window.removeEventListener("keydown", handleDownloadShortcut)
        }
    }, [dismiss, resources, toast])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const isCapsLock = e.getModifierState("CapsLock")
            const key = isCapsLock ? e.key.toLowerCase() : e.key
            if (key === "x" && (e.metaKey || e.ctrlKey)) {
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
            <TitlebarButton onClick={() => setIsOpen(true)} />
            <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
                <CommandInput
                    placeholder="Search resources..."
                    value={query}
                    onValueChange={setQuery}
                />
                <CommandList className={"overflow-hidden max-h-[50dvh]"}>
                    <CommandEmpty
                        className={cn(isStarredFetching || isUnstarredFetching ? "hidden" : "py-6 text-center text-sm")}
                    >
                        No courses found.
                    </CommandEmpty>
                    <div className="my-2 overflow-hidden overflow-y-auto pr-1 space-y-1 max-h-[40dvh]">
                        {isStarredFetching || isUnstarredFetching ? (
                            <div className="overflow-hidden px-1 py-2 space-y-1">
                                <Skeleton className="h-4 w-10 rounded" />
                                <Skeleton className="h-8 rounded-sm" />
                                <Skeleton className="h-8 rounded-sm" />
                            </div>
                        ) : (
                            starredCourses && unstarredCourses && (
                                <>
                                    <CommandGroup
                                        heading={`${starredCourses.EntityArray.length} starred courses found`}
                                    >
                                        <div className="my-2 overflow-hidden pr-1 space-y-1">
                                            {starredCourses.EntityArray.map(element => (
                                                <CommandItem
                                                    key={element.CourseId}
                                                    value={element.Title}
                                                    onSelect={() => handleSelect(() => {
                                                        console.log("Selected course", element)
                                                        navigate(`/courses/${element.CourseId}`)
                                                    })}
                                                >
                                                    <span
                                                        className="truncate break-all line-clamp-1"
                                                    >{element.Title}</span>
                                                </CommandItem>
                                            ))}
                                        </div>
                                    </CommandGroup>
                                    <CommandGroup
                                        heading={`${unstarredCourses.EntityArray.length} unstarred courses found`}
                                    >
                                        <div className="my-2 overflow-hidden pr-1 space-y-1">
                                            {unstarredCourses.EntityArray.map(element => (
                                                <CommandItem
                                                    key={element.CourseId}
                                                    value={element.Title}
                                                    onSelect={() => handleSelect(() => {
                                                        console.log("Selected course", element)
                                                        navigate(`/courses/${element.CourseId}`)
                                                    })}
                                                >
                                                    <span
                                                        className="truncate break-all line-clamp-1"
                                                    >{element.Title}</span>
                                                </CommandItem>
                                            ))}
                                        </div>
                                    </CommandGroup>
                                </>
                            )
                        )}
                        <CommandEmpty
                            className={cn(isResourcesFetching ? "hidden" : "py-6 text-center text-sm")}
                        >
                            No resources found.
                        </CommandEmpty>
                        {isResourcesFetching ? (
                            <div className="overflow-hidden px-1 py-2 space-y-1">
                                <Skeleton className="h-4 w-10 rounded" />
                                <Skeleton className="h-8 rounded-sm" />
                                <Skeleton className="h-8 rounded-sm" />
                            </div>
                        ) : (
                            resources && resources.Resources.EntityArray[0]?.CourseId === courseId && (
                                <CommandGroup
                                    heading={`${resources?.Resources.EntityArray.length
                                        } resources found`}
                                >
                                    <>
                                        {resources!.Resources.EntityArray.map((resource) => (
                                            <CommandItem
                                                data-elementid={resource.ElementId}
                                                key={resource.ElementId}
                                                value={resource.Title}
                                                className="flex items-center justify-between"
                                                onSelect={() => handleSelect(() => {
                                                    console.log("Selected resource", resource)
                                                    if (isSupportedResourceInApp(resource)) {
                                                        navigateToResource(resource)
                                                    } else {
                                                        window.app.openExternal(resource.ContentUrl, true)
                                                    }
                                                })}
                                            >
                                                <span
                                                    className="truncate break-all line-clamp-1"
                                                >{resource.Title}</span>
                                                <div className="flex">
                                                    {isResourceFile(resource) && (
                                                        <Button
                                                            variant={"outline"}
                                                            size={"icon"}
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                toast({
                                                                    title: 'Downloading...',
                                                                    description: resource.Title,
                                                                    duration: 3000,
                                                                })
                                                                window.download.start(resource.ElementId, resource.Title)
                                                                window.ipcRenderer.once('download:complete', (_, args) => {
                                                                    console.log(args)
                                                                    toast({
                                                                        title: 'Downloaded',
                                                                        description: resource.Title,
                                                                        duration: 3000,
                                                                        variant: 'success',
                                                                        onMouseDown: async () => {
                                                                            // if the user clicks on the toast, open the file
                                                                            // get the time that the mouse was pressed
                                                                            const mouseDownTime = new Date().getTime()
                                                                            // wait for the mouse to be released
                                                                            await new Promise<void>((resolve) => {
                                                                                window.addEventListener('mouseup', () => {
                                                                                    resolve()
                                                                                }, { once: true })
                                                                            })

                                                                            // if the mouse was pressed for less than 500ms, open the file
                                                                            if (new Date().getTime() - mouseDownTime < 100) {
                                                                                console.log("Opening shell")
                                                                                await window.app.openShell(args)
                                                                                dismiss()
                                                                            } else {
                                                                                console.log("Not opening shell")
                                                                            }
                                                                        },
                                                                    })
                                                                })
                                                                window.ipcRenderer.once('download:error', (_, args) => {
                                                                    console.log(args)
                                                                    toast({
                                                                        title: 'Download error',
                                                                        description: resource.Title,
                                                                        duration: 3000,
                                                                        variant: 'destructive'
                                                                    })
                                                                })
                                                            }}
                                                        >
                                                            <DownloadIcon className={"w-6 h-6"} />
                                                        </Button>)}
                                                    <div
                                                        className="ml-4 flex h-fit w-fit transform cursor-pointer justify-end rounded-full p-2 transition-all duration-200 ease-in-out bg-background/30 hover:opacity-80 hover:shadow-md active:scale-95 active:opacity-60 md:ml-6 lg:ml-8 xl:ml-10">
                                                        <img src={resource.IconUrl} alt={resource.Title}
                                                            className={"w-6 h-6"} />
                                                    </div>
                                                </div>
                                            </CommandItem>
                                        ))}
                                    </>
                                </CommandGroup>
                            )
                        )}
                    </div>
                </CommandList>
            </CommandDialog>
        </>
    )
}
