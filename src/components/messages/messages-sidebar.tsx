import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Plus} from "lucide-react";
import {AiOutlineSearch} from "react-icons/ai";
import {currentChatAtom} from "@/atoms/current-chat";
import {useAtom} from "jotai";
import React, {useEffect, useState} from "react";

export default function MessagesSidebar({
                                            children,
                                            threadNames
                                        }: {
    threadNames: string[],
    children: React.ReactNode
}) {
    const [, setCurrentChat] = useAtom(currentChatAtom)
    const [search, setSearch] = useState("")
    const [filteredThreadNames, setFilteredThreadNames] = useState<string[]>([])
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

    useEffect(() => {
        console.log(filteredThreadNames)
    }, [filteredThreadNames]);

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
                            setFilteredThreadNames(threadNames.filter((threadName) => threadName.toLowerCase().includes(e.target.value.toLowerCase())))
                        }}
                    />
                    <div className="absolute top-1/2 transform -translate-y-1/2 left-3">
                        <AiOutlineSearch className="w-5 h-5 text-gray-500"/>
                    </div>
                </form>
                <Button onClick={() => setCurrentChat(-1)} variant={"outline"} size={"icon"} className={"shrink-0"}>
                    <Plus className={"w-5 h-5 text-gray-500"}/>
                </Button>
            </div>
            <div className="overflow-y-auto overflow-x-hidden">
                {children}
            </div>
        </div>
    )
}