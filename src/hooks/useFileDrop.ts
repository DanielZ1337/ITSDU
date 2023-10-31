import React, {ChangeEvent, useState} from "react";

export default function useFileDrop({files, setFiles}: {
    files: File[] | null,
    setFiles: React.Dispatch<React.SetStateAction<File[] | null>>
}) {
    const [isOver, setIsOver] = useState(false);

    const handleDragOver = (event: React.DragEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setIsOver(true);
    };

    const handleDragLeave = (event: React.DragEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setIsOver(false);
    };

    const handleDrop = (event: React.DragEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setIsOver(false);

        handleFiles(event);
    }

    const handleFiles = (event: ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLButtonElement>) => {
        let newFiles: File[] = []
        if (event.type === 'drop') {
            event = event as React.DragEvent<HTMLButtonElement>;
            newFiles = Array.from(event.dataTransfer.files);
        } else if (event.target instanceof HTMLInputElement) {
            newFiles = Array.from(event.target.files || []);
        }

        if (files !== null) {
            setFiles([...files, ...newFiles]);
        } else {
            setFiles(newFiles);
        }

        /*// Use FileReader to read file content
        files?.forEach((file) => {
            const reader = new FileReader();

            reader.onloadend = () => {
                console.log(reader.result);
            };

            reader.onerror = () => {
                console.error('There was an issue reading the file.');
            };

            reader.readAsDataURL(file);
            return reader;
        });*/
    }

    return {
        isOver,
        handleDragOver,
        handleDragLeave,
        handleDrop,
        handleFiles
    }
}