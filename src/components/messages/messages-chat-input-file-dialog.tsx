import {Dialog, DialogContent, DialogFooter, DialogTrigger} from "@/components/ui/dialog.tsx";
import {AiOutlineLink} from "react-icons/ai";
import {Loader2, X} from "lucide-react";
import {FileDrop} from "@/file-drop.tsx";
import {Button} from "@/components/ui/button.tsx";
import {DialogClose} from "@radix-ui/react-dialog";


export default function MessagesChatInputFileDialog({
                                                        files,
                                                        setFiles,
                                                        isSendingFile,
                                                        uploadProgress,
                                                    }: {
    files: File[] | null,
    // eslint-disable-next-line no-unused-vars
    setFiles: (files: File[] | null) => void
    isSendingFile: boolean
    uploadProgress: number
}) {
    return (
        <Dialog>
            <DialogTrigger asChild className={"absolute bottom-1.5 right-2"}>
                <button
                    className={"hover:border-border border border-transparent inline-flex items-center justify-center rounded-full p-1 bg-background/60 hover:bg-background/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-background/60"}>
                    {isSendingFile
                        ? <Loader2 className={"w-5 h-5 text-foreground/60 animate-spin"}/>
                        : <AiOutlineLink
                            className={"w-5 h-5 text-foreground/60 hover:text-foreground/80"}/>
                    }
                </button>
            </DialogTrigger>
            <DialogContent className={"p-10 pb-6 flex flex-col gap-4"}>
                <FileDrop setFiles={setFiles} files={files} disabled={isSendingFile}
                          uploadProgress={uploadProgress}/>
                <div
                    className={"flex flex-col gap-2 overflow-x-hidden overflow-y-auto break-all max-h-[20rem] mt-4"}>
                    {files?.map((file, idx) => (
                        <div className={"flex items-center gap-2"}>
                            <X className={"shrink-0 w-5 h-5 text-destructive/60 hover:text-destructive cursor-pointer transition-colors duration-200"}
                               onClick={() => {
                                   const newFiles = [...files!]
                                   newFiles.splice(idx, 1)
                                   setFiles(newFiles)
                               }}/>
                            <span className={"text-foreground/60"}>{file.name}</span>
                            <AiOutlineLink className={"shrink-0 w-5 h-5 text-foreground/60"}/>
                        </div>
                    ))}
                </div>
                <DialogFooter>
                    <Button disabled={isSendingFile} variant={"outline"}
                            onClick={() => setFiles(null)}>
                        {isSendingFile
                            ? <Loader2 className={"w-5 h-5 text-foreground/60 animate-spin"}/>
                            : "Clear"
                        }
                    </Button>
                    <DialogClose asChild>
                        <Button>
                            Done
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}