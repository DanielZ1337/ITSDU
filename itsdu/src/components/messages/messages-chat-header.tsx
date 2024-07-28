import MessagesAddRecipients from "@/components/messages/messages-add-recipients.tsx";
import { useAtom } from "jotai";
import MessagesChatHeaderExistingChat from "@/components/messages/messages-chat-header-existing-chat.tsx";
import { useState } from "react";
import MessageTitleForm from "./messages-title-form";
import { messageSelectedRecipientsAtom } from "@/atoms/message-selected-recipients";
import { ErrorBoundary } from "react-error-boundary";

export default function MessagesChatHeader({
	isChatNew,
	isChatUndefined,
	disabledInputsField,
}: {
	isChatNew: boolean;
	isChatUndefined: boolean;
	disabledInputsField?: boolean;
}) {
	const [isSettingNewThreadName, setIsSettingNewThreadName] =
		useState<boolean>(false);
	const [recipientsSelected] = useAtom(messageSelectedRecipientsAtom);

	return (
		<div className="flex w-full items-center justify-between border-b p-4 min-h-[5rem]">
			<MessageTitleForm
				isChatNew={isChatNew}
				isChatUndefined={isChatUndefined}
				recipientsSelected={recipientsSelected}
				setIsSettingNewThreadName={setIsSettingNewThreadName}
				isSettingNewThreadName={isSettingNewThreadName}
			/>
			{!disabledInputsField && (
				<div className="flex-shrink-0">
					{!isChatNew && !isChatUndefined && (
						<ErrorBoundary fallback={<div>Untitled</div>}>
							<MessagesChatHeaderExistingChat
								isSettingNewThreadName={isSettingNewThreadName}
								setIsSettingNewThreadName={setIsSettingNewThreadName}
							/>
						</ErrorBoundary>
					)}
					{isChatNew && (
						<ErrorBoundary fallback={null}>
							<MessagesAddRecipients />
						</ErrorBoundary>
					)}
				</div>
			)}
		</div>
	);
}
