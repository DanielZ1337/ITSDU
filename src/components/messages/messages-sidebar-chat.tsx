import { currentChatAtom } from "@/atoms/current-chat";
import { messageSelectedRecipientsAtom } from "@/atoms/message-selected-recipients";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/components/ui/avatar.tsx";
import { Button } from "@/components/ui/button.tsx";
import { cn } from "@/lib/utils";
import useDELETEinstantMessageThread from "@/queries/messages/useDELETEinstantMessageThread.ts";
import he from "he";
import { convert } from "html-to-text";
import { useAtom } from "jotai";
import { Trash2Icon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { UnreadNotificationIndicator } from "./unread-notification-indicator";

export default function MessagesSidebarChat({
	title,
	author,
	pictureUrl,
	id,
	canDelete,
	isRead,
}: {
	title: string;
	author: string;
	pictureUrl: string;
	id: number;
	canDelete?: boolean;
	isRead?: boolean;
}) {
	const [currentChatAtomId, setcurrentChatAtomId] = useAtom(currentChatAtom);
	const [, setRecipientsSelected] = useAtom(messageSelectedRecipientsAtom);
	const navigate = useNavigate();

	const { mutate: DELETEinstantMessageThread } = useDELETEinstantMessageThread(
		{
			threadId: id,
		},
		{
			onSuccess: () => {
				if (currentChatAtomId === id) {
					setcurrentChatAtomId(undefined);
					toast.success("Chat deleted");
				}
			},
		},
	);

	const titleSliced = title.slice(0, 100);

	return (
		<button
			tabIndex={0}
			onClick={() => {
				setcurrentChatAtomId(id === currentChatAtomId ? undefined : id);
				if (id !== currentChatAtomId) {
					setRecipientsSelected([]);
				}
			}}
			className={cn(
				"w-full text-left group p-4 border-b cursor-pointer flex items-center hover:bg-foreground/10 transition-colors",
				id === currentChatAtomId && "bg-foreground/10",
				!isRead && isRead !== undefined && "bg-accent/10",
			)}
		>
			<div className="mr-3">
				<Avatar>
					<AvatarImage src={pictureUrl} alt={author} />
					<AvatarFallback>
						{author
							.split(" ")
							.map((name) => name[0])
							.slice(0, 3)
							.join("")}
					</AvatarFallback>
				</Avatar>
			</div>
			<div className={"w-5/6"}>
				<h2 className="text-base font-semibold">{author}</h2>
				<p
					className={cn(
						"text-sm text-gray-500 line-clamp-1 break-all",
						!isRead && "font-semibold",
					)}
				>
					{convert(he.decode(titleSliced))}
				</p>
			</div>
			{!isRead && isRead !== undefined && (
				<UnreadNotificationIndicator read={isRead} ping />
			)}
			{canDelete && (
				<Button
					variant={"outline"}
					size={"icon"}
					onClick={(e) => {
						e.stopPropagation();
						DELETEinstantMessageThread({
							threadId: id,
						});
					}}
					className={
						"group-hover:flex hidden shrink-0 ml-auto mr-[-0.5rem] p-1 rounded-full"
					}
				>
					<Trash2Icon
						className={"w-5 h-5 text-destructive hover:text-destructive/80"}
					/>
				</Button>
			)}
		</button>
	);
}
