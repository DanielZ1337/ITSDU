import { Link } from "react-router-dom";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { ItslearningRestApiEntitiesInstantMessageThread } from "@/types/api-types/utils/Itslearning.RestApi.Entities.InstantMessageThread.ts";

export default function MessagesDropdownHeader({
	disabled,
	onClick,
	threads,
	total,
}: {
	disabled: boolean;
	onClick: () => void;
	threads: ItslearningRestApiEntitiesInstantMessageThread[];
	total: number;
}) {
	return (
		<>
			<Link
				to={"/messages"}
				className={"group flex gap-1 items-center justify-center"}
			>
				<span className={"text-base font-medium group-hover:underline"}>
					Messages
				</span>
				<ArrowRightIcon
					className={
						"stroke-foreground w-4 h-4 group-hover:translate-x-1/3 transition-all duration-200"
					}
				/>
			</Link>
			<div>
				<Button
					variant={"ghost"}
					size={"sm"}
					className="mr-1 h-fit"
					disabled={disabled}
					onClick={onClick}
				>
					Mark all as read
				</Button>
				<span className={"text-xs text-muted-foreground"}>
					{threads && total && `${threads.length}/${total}`}
				</span>
			</div>
		</>
	);
}
