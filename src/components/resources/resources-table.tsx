import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table"
import {ArrowLeft, ArrowUp, ArrowUpDown, ChevronDown, MoreHorizontal} from "lucide-react"

import {Button} from "@/components/ui/button"
import {Checkbox} from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Input} from "@/components/ui/input"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {
    ItslearningRestApiEntitiesPersonalCourseCourseResource
} from "@/types/api-types/utils/Itslearning.RestApi.Entities.Personal.Course.CourseResource.ts";
import {cn} from "@/lib/utils.ts";
import {Link, useMatch, useNavigate} from "react-router-dom"
import {LearningToolIdTypes} from "@/types/api-types/extra/learning-tool-id-types.ts";

export function createColumns(isLoading: boolean, root: boolean): ColumnDef<ItslearningRestApiEntitiesPersonalCourseCourseResource>[] {

    return [
        {
            id: "select",
            header: ({table}) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected()}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({row}) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onClick={(event) => event.stopPropagation()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            id: "type",
            accessorKey: "LearningToolId",
            header: ({column}) => {
                return (
                    <div className="flex items-center justify-center">
                        <Button
                            disabled={isLoading}
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                            className={cn(column.getIsSorted() && "text-foreground-800")}
                        >
                            Type
                            <div className="relative h-4 w-4 ml-2">
                                <ArrowUp
                                    className={cn("absolute h-4 w-4 transform transition-all opacity-100 duration-200 ", column.getIsSorted() === "desc" ? "rotate-180" : "", !column.getIsSorted() && "opacity-0")}/>
                                <ArrowUpDown
                                    className={cn("absolute h-4 w-4 transform transition-all opacity-0 duration-200 ", column.getIsSorted() === "asc" ? "rotate-180" : "", !column.getIsSorted() && "opacity-100")}/>
                            </div>
                        </Button>
                    </div>
                )
            },
            cell: ({row}) => <img src={row.original.IconUrl} alt={row.getValue('Title')} className="w-8 h-8 mx-auto"/>,
        },
        {
            accessorKey: "Title",
            header: ({column}) => {
                return (
                    <Button
                        disabled={isLoading}
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className={cn(column.getIsSorted() && "text-foreground-800")}
                    >
                        Title
                        <div className="relative h-4 w-4 ml-2">
                            <ArrowUp
                                className={cn("absolute h-4 w-4 transform transition-all opacity-100 duration-200 ", column.getIsSorted() === "desc" ? "rotate-180" : "", !column.getIsSorted() && "opacity-0")}/>
                            <ArrowUpDown
                                className={cn("absolute h-4 w-4 transform transition-all opacity-0 duration-200 ", column.getIsSorted() === "asc" ? "rotate-180" : "", !column.getIsSorted() && "opacity-100")}/>
                        </div>
                    </Button>
                )
            },
            cell: ({row}) => {
                const original = row.original
                return (
                    <Link to={root ? `${original.ElementId}` : `../${original.ElementId}`} onClick={(e) => {
                        if (original.ElementType === "Folder") return
                        e.stopPropagation()
                        e.preventDefault()
                        window.app.openExternal(original.ContentUrl)
                    }} className="cursor-pointer text-sm text-foreground-800 hover:underline w-full">
                        {original.Title}
                    </Link>
                )
            }
        },
        {
            id: "published",
            accessorKey: "ElementId",
            header: ({column}) => {
                return (
                    <div className="flex items-center justify-center">
                        <Button
                            disabled={isLoading}
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                            className={cn(column.getIsSorted() && "text-foreground-800")}
                        >
                            Published (ElementId)
                            <div className="relative h-4 w-4 ml-2">
                                <ArrowUp
                                    className={cn("absolute h-4 w-4 transform transition-all opacity-100 duration-200 ", column.getIsSorted() === "desc" ? "rotate-180" : "", !column.getIsSorted() && "opacity-0")}/>
                                <ArrowUpDown
                                    className={cn("absolute h-4 w-4 transform transition-all opacity-0 duration-200 ", column.getIsSorted() === "asc" ? "rotate-180" : "", !column.getIsSorted() && "opacity-100")}/>
                            </div>
                        </Button>
                    </div>
                )
            },
            cell: ({row}) => {
                const original = row.original
                return (
                    <div className="flex items-center justify-center">
                        <div className="text-sm text-muted-foreground">
                            {original.ElementId}
                        </div>
                    </div>
                )
            },
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({row}) => {
                const resource = row.original

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4"/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem
                                onClick={(e) => {
                                    e.stopPropagation()
                                    window.app.openExternal(resource.ContentUrl)
                                }}
                            >
                                View content
                            </DropdownMenuItem>
                            {resource.LearningToolId === LearningToolIdTypes.PDF && (
                                <DropdownMenuItem
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        console.log(resource)
                                        window.download.start(resource.ElementId, resource.Title)
                                    }}
                                >
                                    Download
                                </DropdownMenuItem>)}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]
}

export function ResourcesDataTable({data, isLoading, root = false}: {
    data?: ItslearningRestApiEntitiesPersonalCourseCourseResource[],
    isLoading: boolean,
    root?: boolean
}) {

    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const columns = React.useMemo(() => createColumns(isLoading || !data?.length, root), [isLoading, data, root])
    /* const [rowsAmount, setRowsAmount] = React.useState<number>(Math.floor(window.innerHeight - 200 / 100))

    React.useEffect(() => {
        // base the amount of rows on the height of the div that it is in (minus the header) divided by the height of a row in a initial and resized state
        const handleResize = () => {
            // do it based onthe screen height
            const height = window.innerHeight - 200
            const rows = Math.floor(height / 100)
            setRowsAmount(rows)
        }

        handleResize()

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, []) */

    const table = useReactTable({
        data: data ?? [],
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    const navigate = useNavigate()
    const isRoot = !useMatch("/course/:id/resources/:id")

    console.log(window.history)

    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <div className="flex gap-4 w-full">
                    <Input
                        disabled={isLoading || !data?.length}
                        placeholder="Filter resources..."
                        value={(table.getColumn("Title")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("Title")?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
                    {!isRoot && (
                        <Button className="inline-flex gap-2" variant={"secondary"} onClick={() => {
                            navigate(-1)
                        }}>
                            <ArrowLeft className="h-4 w-4 shrink-0"/>
                            Go Back
                        </Button>
                    )}
                    {/* @ts-ignore */}
                    {table.getFilteredSelectedRowModel().flatRows.filter((row) => row.original.LearningToolId === 5009).length > 0 && (
                        <Button
                            variant="outline"
                            onClick={() => {
                                // @ts-ignore
                                const elements = table.getFilteredSelectedRowModel().flatRows.filter((row) => row.original.LearningToolId === 5009).map((row) => {
                                    return {
                                        ElementId: row.original.ElementId,
                                        Title: row.original.Title
                                    }
                                })

                                elements.forEach((element) => {
                                    window.download.start(element.ElementId, element.Title)
                                })

                            }}>
                            Download all
                        </Button>
                    )}
                    {table.getFilteredSelectedRowModel().flatRows.length > 0 && (
                        <Button
                            variant="outline"
                            onClick={() => {
                                // @ts-ignore
                                const elements = table.getFilteredSelectedRowModel().flatRows.map((row) => row.original.ContentUrl)

                                elements.forEach((element) => {
                                    window.app.openExternal(element, true)
                                })

                            }}>
                            Open all
                        </Button>
                    )}
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto select-none">
                            Columns <ChevronDown className="ml-2 h-4 w-4"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md border overflow-hidden">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : (
                            table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                        onClick={() => row.toggleSelected()}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        className={"select-none"}
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        className={"select-none"}
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}
