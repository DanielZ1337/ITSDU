import { UnreadNotificationIndicator } from "@/components/messages/unread-notification-indicator.tsx";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/components/ui/avatar.tsx";
import { cn } from "@/lib/utils.ts";
import { ItslearningRestApiEntitiesInstantMessageThread } from "@/types/api-types/utils/Itslearning.RestApi.Entities.InstantMessageThread.ts";

export default function MessageDropdownItem({
	thread,
}: { thread: ItslearningRestApiEntitiesInstantMessageThread }) {
	return (
		<div
			className="flex items-center justify-between pr-2 group"
			data-read={
				thread.LastMessage.MessageId === thread.LastReadInstantMessageId
			}
		>
			<div className="flex items-center gap-3">
				<UnreadNotificationIndicator
					ping
					read={
						thread.LastMessage.MessageId === thread.LastReadInstantMessageId
					}
				/>
				<div className="flex flex-col gap-2">
					<span className="flex items-center justify-start gap-2">
						<Avatar>
							<AvatarImage
								src={thread.LastMessage.CreatedByAvatar}
								alt={thread.LastMessage.CreatedByName}
							/>
							<AvatarFallback>
								{thread.LastMessage.CreatedByName.split(" ")
									.map((name) => name[0])
									.slice(0, 3)
									.join("")}
							</AvatarFallback>
						</Avatar>
						<span
							className={
								"text-sm font-medium group-data-[read=true]:font-normal text-foreground line-clamp-2"
							}
						>
							{thread.LastMessage.CreatedByName}
						</span>
					</span>
					<span
						className={cn(
							"group-data-[read=false]:font-medium text-xs text-muted-foreground w-full line-clamp-3 overflow-x-hidden break-all",
							thread.LastMessage.MessageId !==
								thread.LastReadInstantMessageId && "font-semibold",
						)}
					>
						{thread.LastMessage.Text.substring(0, 300)}
					</span>
					<span className="text-xs text-muted-foreground">
						{thread.LastMessage.CreatedLocalDateStamp}
					</span>
				</div>
			</div>
		</div>
	);
}
