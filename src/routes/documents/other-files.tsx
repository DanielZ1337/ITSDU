import React from 'react';
import useResourceByElementID, {ResourceFileType} from '@/queries/resources/useResourceByElementID';
import {useParams} from 'react-router-dom';
import Papa from 'papaparse';

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
} from "@tanstack/react-table";
import {ChevronDown, Loader2} from "lucide-react";

import {Button} from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Input} from "@/components/ui/input";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table";
import CodeBlock from '@/components/code-block';

function createDataColumns(data: any[]): ColumnDef<any>[] {

    return Object.entries(data[0]).map(([key]) => {
        const title = key

        return {
            id: String(title),
            accessorKey: String(title),
            header: title,
            cell: ({row}) => row.getValue(title),
        }
    })
}

function TextFilesDataTable({headers, columns, data, resource, isLoading}: {
    headers?: string[],
    columns?: ColumnDef<any>[],
    data?: any[],
    resource?: ResourceFileType,
    isLoading?: boolean,
}) {

    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const table = useReactTable({
        columns: columns ?? [],
        data: data ?? [],
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

    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <Input
                    placeholder="Search..."
                    onChange={(e) => table.setGlobalFilter(e.target.value)}
                    className='w-1/3'
                />
                <div className="flex-1"/>
                <div
                    className="flex space-x-2"
                >
                    <Button
                        variant="outline"
                        className="ml-auto"
                        disabled={isLoading}
                        onClick={() => {
                            if (!data || !headers) return

                            let url = resource?.url
                            const name = resource?.name ?? "export.csv";
                            if (!url) {
                                const csv = Papa.unparse({
                                    fields: headers,
                                    data: data,
                                });
                                const blob = new Blob([csv], {type: resource?.type ?? "text/csv"});
                                url = window.URL.createObjectURL(blob);
                            }

                            const a = document.createElement("a");
                            a.setAttribute("hidden", "");
                            a.setAttribute("href", url);
                            a.setAttribute("download", name);
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                        }}
                    >
                        Export
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto"
                                    disabled={isLoading}
                            >
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
                                    );
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {columns?.length && (
                            table.getHeaderGroups().map((headerGroup) => (
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
                                        );
                                    })}
                                </TableRow>
                            )))}
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={columns?.length} className="h-24 text-center">
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
                                        colSpan={columns?.length}
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
            <div className="flex items-center justify-end py-4 space-x-2">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
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
    );
}


export default function OtherFiles() {
    const {elementId} = useParams();
    if (!elementId) {
        return <p className="text-primary">Invalid ID</p>;
    }
    const {isLoading, isError, data} = useResourceByElementID(elementId);


    if (isError) {
        return <p className="text-primary">Error</p>;
    }
    let results
    let columns
    if (data) {
        results = Papa.parse(data.text);
        if (results.errors.length) {
            console.error(results.errors)
        } else {
            console.log(results.data)
        }
    }
    const parsedData = results?.data
    const headers = parsedData?.[0] as string[]
    const rows = parsedData?.slice(1).map((row: string[]) => {
        return row.reduce((acc: any, value: string, index: number) => {
            acc[headers[index]] = value
            return acc
        }, {})
    }) as string[][]

    if (rows) {
        columns = createDataColumns(rows)
    }

    const PlainText = () => {
        return (
            <div className="flex h-full flex-col items-center overflow-auto p-6">
                <div className="flex flex-col items-center justify-center gap-4">
                    <div className="flex flex-col items-center gap-4">
                        <h1 className="text-4xl font-bold">Text File</h1>
                        <p className="text-xl">This file is not supported by itslearning.</p>
                    </div>
                    <Button
                        variant="outline"
                        className="ml-auto"
                        disabled={isLoading}
                        onClick={() => {
                            if (!data || !headers) return

                            let url = data?.url
                            const name = data?.name ?? "export.txt";
                            const a = document.createElement("a");
                            a.setAttribute("hidden", "");
                            a.setAttribute("href", url);
                            a.setAttribute("download", name);
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                        }}
                    >
                        Export
                    </Button>
                </div>
                {data?.text}
            </div>
        )
    }

    const JsonRenderer = () => {
        return (
            <div className="flex h-full flex-col items-center p-6">
                <div className="flex flex-col items-center justify-center gap-4">
                    <div className="flex flex-col items-center gap-4">
                        <h1 className="text-4xl font-bold">JSON File</h1>
                        <p className="text-xl">This file is not supported by itslearning.</p>
                    </div>
                    <Button
                        variant="outline"
                        className="ml-auto"
                        disabled={isLoading}
                        onClick={() => {
                            if (!data || !headers) return

                            let url = data?.url
                            const name = data?.name ?? "export.json";
                            const a = document.createElement("a");
                            a.setAttribute("hidden", "");
                            a.setAttribute("href", url);
                            a.setAttribute("download", name);
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                        }}
                    >
                        Export
                    </Button>
                </div>
                <pre className="text-left">
                    {JSON.stringify(JSON.parse(data?.text ?? "{}"), null, 4)}
                </pre>
            </div>
        )
    }

    const renderer = {
        "text/csv": <TextFilesDataTable headers={headers} columns={columns} data={rows} resource={data}
                                        isLoading={isLoading}/>,
        "text/plain": <PlainText/>,
        "application/x-sql": <CodeBlock value={data?.text ?? ""} language="sql"/>,
        "application/x-python": <CodeBlock value={data?.text ?? ""} language="python"/>,
        "application/x-javascript": <CodeBlock value={data?.text ?? ""} language="javascript"/>,
        "application/x-typescript": <CodeBlock value={data?.text ?? ""} language="typescript"/>,
        "application/x-csharp": <CodeBlock value={data?.text ?? ""} language="csharp"/>,
        "application/x-java": <CodeBlock value={data?.text ?? ""} language="java"/>,
        "application/x-markdown": <CodeBlock value={data?.text ?? ""} language="markdown"/>,
        "application/x-yaml": <CodeBlock value={data?.text ?? ""} language="yaml"/>,
        "application/x-xml": <CodeBlock value={data?.text ?? ""} language="xml"/>,
        "application/x-html": <CodeBlock value={data?.text ?? ""} language="html"/>,
        "application/x-css": <CodeBlock value={data?.text ?? ""} language="css"/>,
        "application/x-c": <CodeBlock value={data?.text ?? ""} language="c"/>,
        "application/x-c++": <CodeBlock value={data?.text ?? ""} language="cpp"/>,
        "application/x-rust": <CodeBlock value={data?.text ?? ""} language="rust"/>,
        "application/x-go": <CodeBlock value={data?.text ?? ""} language="go"/>,
        "application/x-kotlin": <CodeBlock value={data?.text ?? ""} language="kotlin"/>,
        "application/x-scala": <CodeBlock value={data?.text ?? ""} language="scala"/>,
        "application/x-ruby": <CodeBlock value={data?.text ?? ""} language="ruby"/>,
        "application/x-php": <CodeBlock value={data?.text ?? ""} language="php"/>,
        "application/x-swift": <CodeBlock value={data?.text ?? ""} language="swift"/>,
        "application/x-dart": <CodeBlock value={data?.text ?? ""} language="dart"/>,
        "application/x-clojure": <CodeBlock value={data?.text ?? ""} language="clojure"/>,
        "application/x-haskell": <CodeBlock value={data?.text ?? ""} language="haskell"/>,
        "application/x-r": <CodeBlock value={data?.text ?? ""} language="r"/>,
        "text/x-java-source": <CodeBlock value={data?.text ?? ""} language="java"/>,
        "application/json": <CodeBlock value={data?.text ?? ""} language="json"/>,
        "image/png": <img src={data?.url} alt={data?.name} className="max-h-full max-w-full object-contain"/>,
        "image/jpeg": <img src={data?.url} alt={data?.name} className="max-h-full max-w-full flex-1 object-contain"/>,
        "image/gif": <img src={data?.url} alt={data?.name} className="max-h-full max-w-full object-contain"/>,
        "image/webp": <img src={data?.url} alt={data?.name} className="max-h-full max-w-full object-contain"/>,
        "image/svg+xml": <img src={data?.url} alt={data?.name} className="max-h-full max-w-full object-contain"/>,
        "video/mp4": <video src={data?.url} controls className="max-h-full max-w-full object-contain"/>,
        "video/webm": <video src={data?.url} controls className="max-h-full max-w-full object-contain"/>,
        "video/ogg": <video src={data?.url} controls className="max-h-full max-w-full object-contain"/>,
        "video/quicktime": <video src={data?.url} controls className="max-h-full max-w-full object-contain"/>,
        "video/x-msvideo": <video src={data?.url} controls className="max-h-full max-w-full object-contain"/>,
        "video/x-flv": <video src={data?.url} controls className="max-h-full max-w-full object-contain"/>,
        "video/x-matroska": <video src={data?.url} controls className="max-h-full max-w-full object-contain"/>,
        "video/x-ms-wmv": <video src={data?.url} controls className="max-h-full max-w-full object-contain"/>,
    } as Record<string, JSX.Element>


    if (data?.type === "text/csv") {
        return (
            <div className='flex h-full flex-col items-center p-6'>
                <TextFilesDataTable headers={headers} columns={columns} data={rows} resource={data}
                                    isLoading={isLoading}/>
            </div>
        )

    }
    //<DownloadButton name={data?.name} url={data?.url} />
    return (
        <div className='m-auto flex h-fit max-h-full max-w-full flex-col items-center justify-center p-6'>
            <div
                className="m-auto flex max-h-full flex-col items-center justify-center rounded-md p-4 ring ring-purple-500/50 bg-foreground/10">
                <div
                    className="m-auto flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-md">
                    {isLoading ? <div className="flex h-full items-center justify-center"><Loader2
                        className={"stroke-foreground shrink-0 h-8 w-8 animate-spin m-auto"}/></div> : null}
                    {data ? renderer[data?.type ?? "text/plain"] ?? <PlainText/> : null}
                </div>
            </div>
        </div>
    )
}

function DownloadButton({url, name}: { url?: string, name?: string }) {
    return (
        <Button
            variant="outline"
            className="ml-auto"
            onClick={() => {
                const a = document.createElement("a");
                a.setAttribute("hidden", "");
                a.setAttribute("href", url ?? "");
                a.setAttribute("download", name ?? "");
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }}
        >
            Export
        </Button>
    )
}