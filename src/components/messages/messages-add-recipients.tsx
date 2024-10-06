import { currentChatEnum } from "@/atoms/current-chat";
import { currentChatAtom } from "@/atoms/current-chat.ts";
import { messageSelectedRecipientsAtom } from "@/atoms/message-selected-recipients.ts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Input } from "@/components/ui/input.tsx";
import { cn } from "@/lib/utils.ts";
import useGETinstantMessagesRecipientsSearch from "@/queries/messages/useGETinstantMessagesRecipientsSearch.ts";
import { ItslearningRestApiEntitiesInstantMessageRecipient } from "@/types/api-types/utils/Itslearning.RestApi.Entities.InstantMessageRecipient.ts";
import { DialogClose } from "@radix-ui/react-dialog";
import { useDebounce } from "@uidotdev/usehooks";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";

export default function MessagesAddRecipients() {
  const [recipientsSearchInput, setRecipientsSearchInput] = useState<string>("");
  const debouncedSearchTerm = useDebounce(recipientsSearchInput, 300);
  const [recipientsSelected, setRecipientsSelected] = useAtom(
    messageSelectedRecipientsAtom,
  );
  const [currentChat] = useAtom(currentChatAtom);
  const [filteredRecipients, setFilteredRecipients] = useState<
    ItslearningRestApiEntitiesInstantMessageRecipient[]
  >([]);

  const { data: recipientsSearch, isFetching: isRecipientsLoading } =
    useGETinstantMessagesRecipientsSearch(
      {
        searchText: debouncedSearchTerm,
      },
      {
        enabled: currentChat === currentChatEnum.NEW,
      },
    );

  useEffect(() => {
    if (recipientsSearch === undefined) return;

    setFilteredRecipients(
      recipientsSearch.filter((recipient) => !recipientsSelected.includes(recipient)),
    );
  }, [recipientsSearch, recipientsSelected]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"} type="button">
          Add participants
        </Button>
      </DialogTrigger>
      <DialogContent
        onEscapeKeyDown={() => {
          setRecipientsSearchInput("");
        }}
        onPointerDownOutside={() => {
          setRecipientsSearchInput("");
        }}
        className={"min-w-[30rem] max-h-[30rem] flex flex-col"}
      >
        <DialogHeader>
          <DialogTitle>Create a new chat</DialogTitle>
          <DialogDescription>Select the people you want to chat with</DialogDescription>
        </DialogHeader>
        <div className="relative flex w-full gap-2 border-b p-4">
          <Input
            autoFocus
            placeholder="Search"
            className="pl-10"
            value={recipientsSearchInput}
            onChange={(e) => setRecipientsSearchInput(e.target.value)}
          />
          <div className="absolute top-1/2 left-7 -translate-y-1/2 transform">
            <AiOutlineSearch className="h-5 w-5 text-gray-500" />
          </div>
        </div>
        <div className="flex w-full gap-2 overflow-hidden">
          <div
            className={cn(
              "w-full flex flex-col overflow-y-auto overflow-x-hidden gap-2",
              recipientsSelected.length > 0 && "border-r-2 -mr-1 pr-2",
            )}
          >
            {isRecipientsLoading ? (
              <div className={"flex flex-col gap-4 w-full justify-center items-center"}>
                <span
                  className={
                    "text-gray-500 flex gap-2 items-center justify-center text-sm sm:text-base md:text-lg font-semibold tracking-tighter"
                  }
                >
                  Loading...
                </span>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 overflow-y-auto overflow-x-hidden">
                {filteredRecipients.map((recipient) => (
                  <Button
                    className={
                      "shrink-0 animate-in slide-in-from-left-16 fade-in-5 py-6 inline-flex gap-3"
                    }
                    key={recipient.Id}
                    variant={"secondary"}
                    onClick={() =>
                      setRecipientsSelected([...recipientsSelected!, recipient])
                    }
                  >
                    <Avatar className={"flex-shrink-0 w-9 h-9"}>
                      <AvatarImage
                        src={recipient.ProfileImageUrl}
                        alt={recipient.SearchLabel}
                        className={"object-cover"}
                      />
                      <AvatarFallback className={"bg-foreground/20"}>
                        {recipient.ShortLabel}
                      </AvatarFallback>
                    </Avatar>
                    <h1 className={"font-semibold text-base"}>{recipient.SearchLabel}</h1>
                  </Button>
                ))}
                {filteredRecipients.length === 0 && (
                  <div
                    className={"flex flex-col gap-4 w-full justify-center items-center"}
                  >
                    <span
                      className={
                        "text-gray-500 flex gap-2 items-center justify-center text-sm sm:text-base md:text-lg font-semibold tracking-tighter"
                      }
                    >
                      No results found
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
          {recipientsSelected.length > 0 && (
            <div
              style={{
                scrollbarGutter: "stable",
              }}
              className="flex flex-1 flex-col gap-2 overflow-y-auto overflow-x-hidden px-2 min-w-[15rem] max-h-[30rem]"
            >
              {recipientsSelected.map((recipient) => (
                <Button
                  className={
                    "shrink-0 animate-in slide-in-from-left-16 fade-in-5 py-7 inline-flex gap-3 bg-success/5 hover:bg-destructive/20"
                  }
                  key={recipient.Id}
                  variant={"secondary"}
                  onClick={() =>
                    setRecipientsSelected(
                      recipientsSelected.filter((r) => r.Id !== recipient.Id),
                    )
                  }
                >
                  <Avatar className={"flex-shrink-0 w-9 h-9"}>
                    <AvatarImage
                      src={recipient.ProfileImageUrl}
                      alt={recipient.SearchLabel}
                      className={"object-cover"}
                    />
                    <AvatarFallback className={"bg-foreground/20"}>
                      {recipient.ShortLabel}
                    </AvatarFallback>
                  </Avatar>
                  <h1 className={"font-semibold text-base"}>{recipient.SearchLabel}</h1>
                </Button>
              ))}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant={"outline"} onClick={() => setRecipientsSelected([])}>
            Clear
          </Button>
          <DialogClose asChild>
            <Button
              onClick={() => {
                setRecipientsSearchInput("");
                // textareaRef.current?.focus()
              }}
            >
              Done
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
