import { currentChatAtom, currentChatEnum } from "@/atoms/current-chat.ts";
import MessagesChatHeader from "@/components/messages/messages-chat-header.tsx";
import MessagesChatInputsField from "@/components/messages/messages-chat-inputs-field.tsx";
import MessagesSidebar from "@/components/messages/messages-sidebar.tsx";
import useGETinstantMessageThread from "@/queries/messages/useGETinstantMessageThread";
import { useAtom } from "jotai";
import { Suspense, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Helmet } from "react-helmet-async";
import MessagesChatFallback from "./fallbacks/messages-chat-fallback";
import MessageChat from "./messages-chat";
import { useParams } from "react-router-dom";

export default function Messages() {
	const [currentChat, setCurrentChat] = useAtom(currentChatAtom);
	const params = useParams<{ id: string }>();
	const isChatExisting =
		currentChat !== currentChatEnum.NONE && currentChat !== currentChatEnum.NEW;
	const isChatNew = currentChat === currentChatEnum.NEW;
	const isChatNewOrExisting = isChatExisting || isChatNew;
	const isChatUndefined = currentChat === currentChatEnum.NONE;

	useEffect(() => {
		if (!params.id) return;
		const MessageThreadId = Number(params.id);
		if (Number.isNaN(MessageThreadId)) return;
		setCurrentChat(Number(params.id));
	}, [params.id]);

	const { data: messages, isLoading } = useGETinstantMessageThread(
		{
			threadId: currentChat!,
			maxMessages: 1,
		},
		{
			enabled: isChatExisting,
		},
	);

	const disabledInputsField =
		isChatExisting && messages?.OnlyThreadAdminCanSendToThread;

	return (
		<div className="flex h-full w-full flex-1 overflow-y-hidden">
			<Helmet>
				<title>Messages</title>
			</Helmet>
			<div className="w-1/4 overflow-x-hidden overflow-y-hidden border-r">
				<MessagesSidebar />
			</div>
			<div className="flex w-3/4 flex-col">
				<MessagesChatHeader
					isChatNew={isChatNew}
					isChatUndefined={isChatUndefined}
					disabledInputsField={disabledInputsField}
				/>
				<div className="flex flex-1 flex-col-reverse gap-4 overflow-y-auto overflow-x-hidden p-4">
					{isChatExisting && (
						<ErrorBoundary fallback={<MessagesChatFallback />}>
							<Suspense fallback={<MessagesChatFallback />}>
								<MessageChat threadId={currentChat} />
							</Suspense>
						</ErrorBoundary>
					)}
				</div>
				{isChatNewOrExisting && !disabledInputsField && !isLoading && (
					<ErrorBoundary fallback={null}>
						<MessagesChatInputsField key={currentChat} />
					</ErrorBoundary>
				)}
			</div>
		</div>
	);
}
