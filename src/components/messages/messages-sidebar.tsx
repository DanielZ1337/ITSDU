import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Plus} from "lucide-react";
import {AiOutlineSearch} from "react-icons/ai";
import {currentChatAtom, currentChatEnum} from "@/atoms/current-chat";
import {useAtom} from "jotai";
import React, {Suspense, useEffect, useState} from "react";
import MessagesSidebarChat from "./messages-sidebar-chat";
import MessageSidebarChatLoader from "./message-sidebar-chat-loader";
import MessagesSidebarChatList from "./messages-sidebar-chat-list";

export default function MessagesSidebar() {
    const [currentChat, setCurrentChat] = useAtom(currentChatAtom)
    const [search, setSearch] = useState("")
    const inputRef = React.useRef<HTMLInputElement>(null)

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "n" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setCurrentChat(-1)
            }
            if (e.key === "w" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setCurrentChat(undefined)
            }
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setSearch("")
                inputRef.current?.focus()
            }
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [setCurrentChat])

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b flex gap-2">
                <form className="relative w-full">
                    <Input
                        ref={inputRef}
                        placeholder="Search"
                        className="pl-10"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value)
                        }}
                    />
                    <div className="absolute top-1/2 transform -translate-y-1/2 left-3">
                        <AiOutlineSearch className="w-5 h-5 text-gray-500"/>
                    </div>
                </form>
                <Button onClick={() => setCurrentChat(currentChatEnum.NEW)} variant={"outline"} size={"icon"}
                        className={"shrink-0"}>
                    <Plus className={"w-5 h-5 text-gray-500"}/>
                </Button>
            </div>
            <div className="overflow-y-auto overflow-x-hidden">
                {currentChat === currentChatEnum.NEW && (
                    <div className={"animate-in slide-in-from-left-16"}>
                        <MessagesSidebarChat
                            title={"New chat"}
                            author={"Create a new chat"}
                            pictureUrl={"itsl-itslearning-file://icon.ico"}
                            id={currentChatEnum.NEW}
                        />
                    </div>
                )}
                <Suspense fallback={[...Array(10)].map((_, i) => (
                    <div key={i} className={"animate-in slide-in-from-left-32"}>
                        <MessageSidebarChatLoader/>
                    </div>
                ))}>
                    <MessagesSidebarChatList query={search}/>
                </Suspense>
            </div>
        </div>
    )
}