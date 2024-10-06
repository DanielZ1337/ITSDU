import { cn, isMacOS } from "@/lib/utils";
import { Search } from "lucide-react";
import React, { forwardRef } from "react";
import { Button, ButtonProps } from "../ui/button";

const TitlebarButton = forwardRef<HTMLButtonElement, ButtonProps>(
	({ onClick, className, ...props }, ref) => {
		return (
			<Button
				ref={ref}
				size={"sm"}
				className={cn(
					"relative inline-flex h-9 w-full items-center justify-start rounded-md border bg-transparent text-sm font-medium shadow-sm transition-colors no-drag border-input text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-1 active:scale-100 disabled:pointer-events-none disabled:opacity-50",
					className,
				)}
				onClick={onClick}
				{...props}
			>
				<Search className={"h-4 w-4 shrink-0"} />
				<span className="ml-2">Search...</span>
				<kbd className="pointer-events-none absolute right-2 my-auto flex h-5 select-none items-center gap-1 rounded border font-mono font-medium opacity-100 bg-muted px-1.5 text-[10px]">
					<span>{isMacOS() ? "⌘" : "Ctrl"}</span>X
				</kbd>
				<span className="sr-only">Search resources</span>
			</Button>
		);
	},
);

export default TitlebarButton;
