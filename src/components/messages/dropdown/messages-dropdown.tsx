import { currentChatAtom } from "@/atoms/current-chat.ts";
import MessagesDropdownInfiniteFallback from "@/components/messages/dropdown/fallbacks/messages-dropdown-infinite-fallback.tsx";
import MessagesDropdownHeader from "@/components/messages/dropdown/messages-dropdown-header.tsx";
import MessagesDropdownInfiniteEnd from "@/components/messages/dropdown/messages-dropdown-infinite-end.tsx";
import MessageDropdownItem from "@/components/messages/dropdown/messages-dropdown-item.tsx";
import MessagesDropdownNoMessages from "@/components/messages/dropdown/messages-dropdown-no-messages.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import UnreadNotificationsPingIndicator from "@/components/unread-notifications-ping-indicator.tsx";
import useFetchNextPageOnInView from "@/hooks/useFetchNextPageOnView.ts";
import { cn } from "@/lib/utils.ts";
import useGETinstantMessagesv2 from "@/queries/messages/useGETinstantMessagesv2.ts";
import { TanstackKeys } from "@/types/tanstack-keys.ts";
import { ScrollShadow } from "@nextui-org/react";
import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { MessageCircle } from "lucide-react";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import usePUTinstantMessageThreadUpdateIsRead from "../../../queries/messages/usePUTinstantMessageThreadUpdateIsRead.ts";
import MessagesDropdownFallback from "./fallbacks/messages-dropdown-fallback.tsx";

export default function MessagesDropdown() {
	const navigate = useNavigate();
	const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
		useGETinstantMessagesv2(
			{
				maxThreadCount: 15,
				maxMessages: 9,
				threadPage: 0,
			},
			{
				suspense: true,
			},
		);

	const { mutate: markAsRead, isLoading } =
		usePUTinstantMessageThreadUpdateIsRead();

	const ref = useFetchNextPageOnInView(
		hasNextPage,
		fetchNextPage,
		isFetchingNextPage,
	);

	const threads = data!.pages.flatMap((page) => page.EntityArray);
	const total = data!.pages[data!.pages.length - 1].Total;
	const unreadThreads = threads?.filter(
		(thread) =>
			thread.LastMessage.MessageId !== thread.LastReadInstantMessageId,
	);
	const [, setCurrentChat] = useAtom(currentChatAtom);
	const queryClient = useQueryClient();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant={"ghost"} size={"icon"} className={"shrink-0 relative"}>
					<MessageCircle />
					{unreadThreads && unreadThreads.length > 0 && (
						<UnreadNotificationsPingIndicator amount={unreadThreads.length} />
					)}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-80">
				<DropdownMenuLabel className={"flex justify-between items-center"}>
					<MessagesDropdownHeader
						disabled={isLoading}
						onClick={() => {
							threads?.forEach((thread) => {
								markAsRead({
									lastReadInstantMessageId:
										thread.Messages.EntityArray[
											thread.Messages.EntityArray.length - 1
										].MessageId,
									threadId: thread.InstantMessageThreadId,
								});
							});

							queryClient.invalidateQueries([TanstackKeys.Messagesv2]);
						}}
						threads={threads}
						total={total}
					/>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					{!threads && (
						<ScrollShadow
							className={
								"w-full h-72 my-2 px-2 scrollbar hover:scrollbar-thumb-foreground/15 active:scrollbar-thumb-foreground/10 scrollbar-thumb-foreground/20 scrollbar-w-2 scrollbar-thumb-rounded-full"
							}
						>
							<div className="pr-2 pb-2">
								{[...Array(10)].map((_, idx) => (
									<Fragment key={idx}>
										<MessagesDropdownFallback hideSeparator={idx === 9} />
									</Fragment>
								))}
							</div>
						</ScrollShadow>
					)}
					{threads && (
						<ScrollShadow
							className={
								"h-72 w-full my-2 px-2 scrollbar overflow-x-hidden hover:scrollbar-thumb-foreground/15 active:scrollbar-thumb-foreground/10 scrollbar-thumb-foreground/20 scrollbar-w-2 scrollbar-thumb-rounded-full"
							}
						>
							{threads.length === 0 && <MessagesDropdownNoMessages />}
							{threads &&
								threads.length > 0 &&
								threads.map((thread, idx) => (
									<div key={idx} className={"overflow-x-hidden w-full"}>
										<DropdownMenuItem
											onClick={() => {
												// navigate(`/messages/${thread.InstantMessageThreadId}`)
												navigate(`/messages`);
												setCurrentChat(thread.InstantMessageThreadId);
											}}
										>
											<MessageDropdownItem thread={thread} />
										</DropdownMenuItem>
										<Separator
											className={cn(
												"my-2",
												idx === threads.length - 1 && "hidden",
											)}
										/>
									</div>
								))}
							{isFetchingNextPage && <MessagesDropdownInfiniteFallback />}
							{!hasNextPage && <MessagesDropdownInfiniteEnd />}
							{hasNextPage && <div ref={ref} />}
						</ScrollShadow>
					)}
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
