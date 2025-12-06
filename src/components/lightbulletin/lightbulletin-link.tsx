import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import React from "react";

export default function LightbulletinLink({
	className,
	children,
	...props
}: {
	className?: string;
	children?: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
	return (
		<button
			className={cn(
				"inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm",
				"bg-primary/10 hover:bg-primary/20 border border-primary/20 hover:border-primary/30",
				"text-foreground transition-colors cursor-pointer",
				className,
			)}
			{...props}
		>
			{children}
			<ExternalLink className="w-3 h-3 text-muted-foreground" />
		</button>
	);
}
