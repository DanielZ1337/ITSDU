import { useAISidepanel } from "@/hooks/atoms/useAISidepanel";
import { cn } from "@/lib/utils";
import { ArrowLeftToLine, ArrowRightToLine } from "lucide-react";
import { Button, ButtonProps } from "../ui/button";

export default function AISidepanelButton({
	className,
	variant,
	...props
}: {
	className?: string;
	variant?: ButtonProps["variant"];
} & Omit<ButtonProps, "variant">) {
	const { aiSidepanel, toggleSidebar } = useAISidepanel();
	return (
		<Button
			className={cn("group", className)}
			variant={variant ?? "ghost"}
			{...props}
			data-active={aiSidepanel}
			onClick={toggleSidebar}
		>
			<span className="relative h-4 w-4">
				<ArrowRightToLine className="w-4 h-4 absolute group-data-[active=false]:opacity-0 transition-all" />
				<ArrowLeftToLine className="w-4 h-4 absolute animate-in group-data-[active=true]:opacity-0 transition-all" />
			</span>
		</Button>
	);
}
