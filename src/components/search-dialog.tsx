import {Search} from "lucide-react";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {Skeleton} from "@/components/ui/skeleton";
import {CommandDialog, CommandEmpty, CommandInput, CommandList} from "@/components/ui/command";
import {useDebounce} from "@uidotdev/usehooks";
import {useCallback, useEffect, useState, useTransition} from "react";

export default function SearchProductsDialog() {
    const [isOpen, setIsOpen] = useState(false)
    const [query, setQuery] = useState("")
    const debouncedQuery = useDebounce(query, 300)
    const [data, setData] = useState<any>(null)
    const [isPending, startTransition] = useTransition()

    useEffect(() => {
        if (debouncedQuery.length === 0) setData(null)

        if (debouncedQuery.length > 0) {
            startTransition(() => {
                // const data = await filterProductsAction(debouncedQuery)
                setData(data)
            })
        }
    }, [data, debouncedQuery])

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
                className="inline-flex items-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
                onClick={() => setIsOpen(true)}
            >
                <Search className={"h-4 w-4 xl:mr-2"} />
                <span className="hidden lg:inline-flex">Search products...</span>
                <span
                    className="inline-flex lg:hidden">Search...</span>
                <kbd
                    className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                    <span className="text-xs">⌘</span>K
                </kbd>
                <span className="sr-only">Search products</span>
            </Button>
            <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
                <CommandInput
                    placeholder="Search products..."
                    value={query}
                    onValueChange={setQuery}
                />
                <CommandList>
                    <CommandEmpty
                        className={cn(isPending ? "hidden" : "py-6 text-center text-sm")}
                    >
                        No products found.
                    </CommandEmpty>
                    {isPending ? (
                        <div className="space-y-1 overflow-hidden px-1 py-2">
                            <Skeleton className="h-4 w-10 rounded"/>
                            <Skeleton className="h-8 rounded-sm"/>
                            <Skeleton className="h-8 rounded-sm"/>
                        </div>
                    ) : (
                        /*data?.map((group) => (
                            <CommandGroup
                                key={group.category}
                                className="capitalize"
                                heading={group.category}
                            >
                                {group.products.map((item) => (
                                    <CommandItem
                                        key={item.id}
                                        onSelect={() =>
                                            handleSelect(() => router.push(`/product/${item.id}`))
                                        }
                                    >
                                        {item.name}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        ))*/
                        <>
                        </>
                    )}
                </CommandList>
            </CommandDialog>
        </>
    )
}