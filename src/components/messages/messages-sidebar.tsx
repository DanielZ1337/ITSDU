import { currentChatAtom, currentChatEnum } from "@/atoms/current-chat";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { useAtom } from "jotai";
import { Plus } from "lucide-react";
import React, { Suspense, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { AiOutlineSearch } from "react-icons/ai";
import MessageSidebarChatFallback from "./fallbacks/message-sidebar-chat-fallback";
import MessagesSidebarChat from "./messages-sidebar-chat";
import MessagesSidebarChatList from "./messages-sidebar-chat-list";

export default function MessagesSidebar() {
  const [currentChat, setCurrentChat] = useAtom(currentChatAtom);
  const [search, setSearch] = useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "n" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCurrentChat(-1);
      }
      if (e.key === "w" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCurrentChat(undefined);
      }
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearch("");
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setCurrentChat]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex gap-2 border-b p-4">
        <div className="relative w-full">
          <Input
            ref={inputRef}
            placeholder="Search"
            className="pl-10"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
          <div className="absolute top-1/2 left-3 -translate-y-1/2 transform">
            <AiOutlineSearch className="h-5 w-5 text-gray-500" />
          </div>
        </div>
        <Button
          onClick={() => setCurrentChat(currentChatEnum.NEW)}
          variant={"outline"}
          size={"icon"}
          className={"shrink-0"}
        >
          <Plus className={"h-5 w-5 text-gray-500"} />
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
        <ErrorBoundary
          fallback={
            <>
              {[...Array(10)].map((_, i) => (
                <div key={i} className={"animate-in slide-in-from-left-32"}>
                  <MessageSidebarChatFallback />
                </div>
              ))}
            </>
          }
        >
          <Suspense
            fallback={[...Array(10)].map((_, i) => (
              <div key={i} className={"animate-in slide-in-from-left-32"}>
                <MessageSidebarChatFallback />
              </div>
            ))}
          >
            <MessagesSidebarChatList query={search} />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
}
