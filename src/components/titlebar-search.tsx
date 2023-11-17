import React from 'react'
import {Button} from '@/components/ui/button'
import {Search} from 'lucide-react'
import {cn, isMacOS} from '@/lib/utils'
import {Skeleton} from '@/components/ui/skeleton'
import {CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandList} from './ui/command'

export default function TitlebarSearch() {
    const [isOpen, setIsOpen] = React.useState(false)
    const [query, setQuery] = React.useState("")
    const [isFetching, setIsFetching] = React.useState(true)


    return (
        <>
            <Button
                size={"sm"}
                className="active:scale-100 no-drag h-9 border w-full inline-flex items-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground relative justify-start text-sm text-muted-foreground"
                onClick={() => setIsOpen(true)}
            >
                <Search className={"h-4 w-4 shrink-0"}/>
                <span className="ml-2">Search...</span>
                <kbd
                    className="pointer-events-none absolute right-2 my-auto flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
                    <span>
                        {isMacOS() ? "⌘" : "Ctrl"}
                    </span>
                    K
                </kbd>
                <span className="sr-only">Search resources</span>
            </Button>
            <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
                <CommandInput
                    placeholder="Search resources..."
                    value={query}
                    onValueChange={setQuery}
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
                        <CommandGroup heading={"Resources"}>
                            <div className="my-2 space-y-1 overflow-hidden pr-1 overflow-y-auto max-h-[40dvh]">
                            </div>
                        </CommandGroup>
                    )}
                </CommandList>
            </CommandDialog>
        </>
    )
}
