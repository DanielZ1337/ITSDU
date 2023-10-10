import {cn} from "@/lib/utils.ts";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import he from "he"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Button} from "@/components/ui/button.tsx";
import {ChevronDown} from "lucide-react";
import {Dialog, DialogContent, DialogFooter, DialogTrigger} from "@/components/ui/dialog.tsx";
import Linkify from "linkify-react";
import renderLink from "@/components/custom-render-link-linkify.tsx";
import {useToast} from "@/components/ui/use-toast.ts";

export default function MessageChat({
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
                                    }: {
    me: boolean
    pictureUrl: string
    messageText: string
    author: string
    time: string
    edited?: boolean
    attachmentName?: string
    attachmentUrl?: string
    isSystemMessage?: boolean
    canDelete?: boolean
}) {

    const isImage = attachmentUrl && attachmentName.match(/\.(jpeg|jpg|gif|png)$/)

    const isVideo = attachmentUrl && attachmentName.match(/\.(mp4|webm|ogg)$/)

    const {toast,dismiss} = useToast()

    if (isSystemMessage) return (
        <p className={cn("whitespace-pre-wrap break-all text-center text-gray-500 italic")}>{he.decode(messageText)}</p>
    )


    return (
        <div className={cn("mb-4 flex", me ? "justify-end" : "justify-start")}>
            <div className={cn('relative', me ? "order-2 ml-3" : "order-1 mr-3")}>
                <Avatar>
                    <AvatarImage src={pictureUrl}
                                 alt={author}/>
                    <AvatarFallback>
                        {author.split(" ").map((name) => name[0]).slice(0, 3).join("")}
                    </AvatarFallback>
                </Avatar>
                {me && (
                    <div className={"absolute -bottom-2 -left-1.5"}>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant={"ghost"} size={"smSquare"}>
                                    <ChevronDown/>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align={"end"}>
                                <DropdownMenuItem>Copy</DropdownMenuItem>
                                {canDelete && (
                                    <DropdownMenuItem

                                    >Delete</DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )}
            </div>
            <div className={cn(me ? "order-1" : "order-2")}>
                <p className={cn("text-sm text-gray-500 ", me ? 'text-end' : 'text-start')}>
                    {time}
                    {edited && <span className={"text-gray-400"}> (edited)</span>}
                </p>
                <div
                    className={cn("mt-1 p-2 rounded-lg inline-block", me ? 'float-right bg-blue-500 text-white' : 'float-left', !isImage && 'bg-foreground/10')}>
                    <p className={cn("whitespace-pre-wrap break-all")}>
                        <Linkify options={{render: renderLink}}>
                            {he.decode(messageText)}
                        </Linkify>
                    </p>
                    {attachmentUrl && !isImage && (
                        <a href={attachmentUrl}
                           className={"text-blue-500 hover:underline"}
                           onClick={(e) => {
                               e.stopPropagation()
                               console.log(attachmentUrl, attachmentName)
                               window.download.external(attachmentUrl, attachmentName)
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
                                               }, {once: true})
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
                            <DialogTrigger>
                                <img
                                    src={attachmentUrl}
                                    alt={attachmentName}
                                    className={"max-w-full h-full rounded-md hover:scale-105 transform transition-all duration-200"}
                                />
                            </DialogTrigger>
                            <DialogContent
                                className={"break-all bg-foreground/5 backdrop-blur-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-opacity-50 max-w-[50dvw]"}>
                                <div className={"flex flex-col items-center"}>
                                    <img
                                        src={attachmentUrl}
                                        alt={attachmentName}
                                        className={"max-w-[50dvw] max-h-[50dvh] rounded-md object-contain"}
                                    />
                                    <p className={"text-gray-500 text-sm"}>{attachmentName}</p>
                                </div>
                                <DialogFooter>
                                    <Button variant={"outline"} className={"mr-2"} onClick={() => {
                                        console.log(attachmentUrl, attachmentName)
                                        window.download.external(attachmentUrl, attachmentName)
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
                                                        }, {once: true})
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
                                    }}>
                                        Download
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    )}
                    {attachmentUrl && isVideo && (
                        <video controls className={"max-w-full h-full rounded-lg"} src={attachmentUrl}/>
                    )}
                </div>
            </div>
        </div>
    )
}