import React, {ChangeEvent} from 'react';
import {cn} from "@/lib/utils.ts";
import {UploadIcon} from "lucide-react";
import {Progress} from "@/components/ui/progress.tsx";
import useFileDrop from "@/hooks/useFileDrop.ts";

export function MessagesFileDrop({files, setFiles, disabled, uploadProgress}: {
    files: File[] | null,
    // eslint-disable-next-line no-unused-vars
    setFiles: (files: File[]) => void
    disabled?: boolean
    uploadProgress: number
}) {
    const {handleDrop, handleFiles, handleDragOver, isOver, handleDragLeave} = useFileDrop({
        files,
        setFiles
    })

    return (
        <button
            disabled={disabled}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
                'bg-foreground/10 mt-2 flex flex-col items-center justify-center rounded-lg px-6 py-10 text-center cursor-pointer border-dashed border-2 border-foreground/10 disabled:pointer-events-none disabled:opacity-50',
                isOver && 'bg-foreground/5 border-foreground/20'
            )}
            onClick={() => {
                // Open the file dialog programmatically
                const fileInput = document.createElement('input');
                fileInput.type = 'file';
                fileInput.multiple = true;
                fileInput.style.display = 'none'; // Hide the input element
                document.body.appendChild(fileInput);
                // @ts-ignore
                fileInput.addEventListener('change', (e: ChangeEvent<HTMLInputElement>) => handleFiles(e));
                fileInput.click();
                document.body.removeChild(fileInput);
            }}
        >
            <UploadIcon className={"pointer-events-none mx-auto block h-12 w-12 align-middle text-gray-400"}/>
            <h1
                className={cn("relative mt-4 flex w-64 cursor-pointer items-center justify-center text-sm font-semibold leading-6 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 text-foreground/80 hover:text-foreground")}>
                Choose files or drag and drop
            </h1>
            {uploadProgress > 0 && (
                <Progress className={"mt-4 w-64"} indicatorClassName={"bg-green-500"} value={uploadProgress}/>
            )}
            {/*<h2 className="m-0 h-[1.25rem] text-xs leading-5 text-foreground/25">
                Image (2MB)
            </h2>*/}
        </button>
    )
}

