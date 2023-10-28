import { cn } from "@/lib/utils.ts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.tsx";
import he from "he"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import { Button } from "@/components/ui/button.tsx";
import { ChevronDown, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogTrigger } from "@/components/ui/dialog.tsx";
import Linkify from "linkify-react";
import renderLink from "@/components/custom-render-link-linkify.tsx";
import { useToast } from "@/components/ui/use-toast.ts";
import { useState } from "react";
import useDELETEinstantMessage from "@/queries/messages/useDELETEinstantMessage";
import { useQueryClient } from "@tanstack/react-query";

export default function MessageChatMessage({
    me,
    pictureUrl,
    messageText,
    author,
    time,
    edited,
    attachmentName,
    attachmentUrl,
    isSystemMessage,
    canDelete,
    id
}: {
    me?: boolean
    pictureUrl: string
    messageText: string
    author: string
    time: string
    edited?: boolean
    attachmentName?: string
    attachmentUrl?: string
    isSystemMessage?: boolean
    canDelete?: boolean,
    id: number
}) {

    const queryClient = useQueryClient()

    const isImage = attachmentUrl && attachmentName?.match(/\.(jpeg|jpg|gif|png)$/)

    const isVideo = attachmentUrl && attachmentName?.match(/\.(mp4|webm|ogg)$/)

    const [isDownloadingImage, setIsDownloadingImage] = useState<boolean>(false)

    const { toast, dismiss } = useToast()

    const { mutate: deleteMessage, isLoading } = useDELETEinstantMessage({
        onSuccess: () => {
            queryClient.invalidateQueries(['messagesv2'])
        }
    })

    if (isSystemMessage) return (
        <p className={cn("whitespace-pre-wrap break-all text-center text-gray-500 italic")}>{he.decode(messageText)}</p>
    )

    return (
        <div className={cn("mb-4 flex flex-col")}>
            <span
                className={cn("font-semibold flex text-sm text-foreground/80 mb-1", me ? "justify-end" : "justify-start")}>
                {author}
            </span>
            <div className={cn("flex", me ? "justify-end" : "justify-start")}>
                <div className={cn('relative', me ? "order-2 ml-3" : "order-1 mr-3")}>
                    <Avatar>
                        <AvatarImage src={pictureUrl}
                            alt={author} />
                        <AvatarFallback>
                            {author.split(" ").map((name) => name[0]).slice(0, 3).join("")}
                        </AvatarFallback>
                    </Avatar>
                    {/* {me && ( */}
                    <div className={"absolute -bottom-2 -left-1.5"}>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant={"ghost"} size={"smSquare"}>
                                    <ChevronDown />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align={"end"}>
                                <DropdownMenuItem>Copy</DropdownMenuItem>
                                {canDelete && (
                                    <DropdownMenuItem
                                        onClick={() => {
                                            deleteMessage({ instantMessageId: id })
                                        }}
                                        disabled={isLoading}
                                        className="hover:!bg-destructive"
                                    >Delete</DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    {/* )} */}
                </div>
                <div className={cn(me ? "order-1" : "order-2")}>
                    <p className={cn("text-sm text-gray-500 ", me ? 'text-end' : 'text-start')}>
                        {time}
                        {edited && <span className={"text-gray-400"}> (edited)</span>}
                    </p>
                    <div
                        className={cn("transform transition-all mt-1 p-2 rounded-lg inline-block h-fit", me ? 'float-right bg-blue-500 text-white' : 'float-left bg-foreground/10', isImage || isVideo ? 'max-w-[50dvw] max-h-[50dvh] bg-transparent' : 'max-w-[80dvw]', isLoading && 'cursor-progress opacity-50')}>
                        <p className={cn("whitespace-pre-wrap break-all")}>
                            <Linkify options={{ render: renderLink }}>
                                {he.decode(messageText)}
                            </Linkify>
                        </p>
                        {attachmentUrl && !isImage && (
                            <a href={attachmentUrl}
                                className={cn("hover:underline", me ? 'text-white' : 'text-blue-500')}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    console.log(attachmentUrl, attachmentName)
                                    window.download.external(attachmentUrl, attachmentName!)
                                    window.ipcRenderer.once('download:complete', (_, args) => {
                                        console.log(args)
                                        toast({
                                            title: 'Downloaded',
                                            description: attachmentName,
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
                                            description: attachmentName,
                                            duration: 3000,
                                            variant: 'destructive'
                                        })
                                    })
                                }}
                            >
                                <p>{attachmentName}</p>
                            </a>
                        )}
                        {attachmentUrl && isImage && (
                            <Dialog>
                                <DialogTrigger className={"max-w-[50dvw] max-h-[50dvh] rounded-md overflow-hidden"}>
                                    <img
                                        src={attachmentUrl}
                                        alt={attachmentName}
                                        className={"max-w-full h-full rounded-md hover:scale-105 transform transition-all duration-200"}
                                    />
                                </DialogTrigger>
                                <DialogContent
                                    className={"break-all bg-foreground/5 backdrop-blur-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-opacity-50 max-h-[80dvh] max-w-[80dvh]"}>
                                    <div className={"rounded-md mx-auto w-fit mt-4 overflow-hidden"}>
                                        <img
                                            loading={"lazy"}
                                            src={attachmentUrl}
                                            alt={attachmentName}
                                            className={"max-w-full h-full hover:scale-105 transform transition-all duration-200"}
                                        />
                                    </div>
                                    <p className={"mt-0 sm:mt-2 xl:mt-4 xl:text-base text-gray-500 text-sm text-center"}>{attachmentName}</p>
                                    <DialogFooter>
                                        <Button disabled={isDownloadingImage} variant={"outline"}
                                            className={"mr-2 inline-flex gap-2"} onClick={() => {
                                                setIsDownloadingImage(true)
                                                window.download.external(attachmentUrl, attachmentName!)
                                                window.ipcRenderer.once('download:complete', (_, args) => {
                                                    console.log(args)
                                                    toast({
                                                        title: 'Downloaded',
                                                        description: attachmentName,
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
                                                    setIsDownloadingImage(false)
                                                })
                                                window.ipcRenderer.once('download:error', (_, args) => {
                                                    console.log(args)
                                                    toast({
                                                        title: 'Download error',
                                                        description: attachmentName,
                                                        duration: 3000,
                                                        variant: 'destructive'
                                                    })
                                                    setIsDownloadingImage(false)
                                                })
                                            }}>
                                            {isDownloadingImage && (
                                                <Loader2 className={"stroke-foreground shrink-0 h-6 w-6 animate-spin"} />
                                            )}
                                            Download
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        )}
                        {attachmentUrl && isVideo && (
                            <video controls className={"max-w-full h-full rounded-lg max-h-[47dvh]"}
                                src={attachmentUrl} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}