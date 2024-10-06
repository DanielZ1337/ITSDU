import MessagesOtherActionsDropdown from "@/components/messages/messages-other-actions-dropdown";
import { Button } from "@/components/ui/button.tsx";

export default function MessagesChatHeaderExistingChat({
	isSettingNewThreadName,
	setIsSettingNewThreadName,
}: {
	isSettingNewThreadName: boolean;
	// eslint-disable-next-line no-unused-vars
	setIsSettingNewThreadName: (value: boolean) => void;
}) {
	return (
		<div className={"flex space-x-2"}>
			<MessagesOtherActionsDropdown />
			<Button
				variant={"outline"}
				type="button"
				onClick={() => setIsSettingNewThreadName(!isSettingNewThreadName)}
			>
				{isSettingNewThreadName ? "Cancel" : "Edit name"}
			</Button>
		</div>
	);
}
