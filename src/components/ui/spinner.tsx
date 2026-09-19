import { cn } from "@/lib/utils";

const sizes = { sm: "h-5 w-5 border-2", md: "h-8 w-8 border-[3px]", lg: "h-10 w-10 border-4" } as const;

type SpinnerProps = {
	size?: keyof typeof sizes;
	/** Kept for call-site compatibility; the spinner always uses the primary colour. */
	color?: "primary";
	label?: string;
	className?: string;
	style?: React.CSSProperties;
};

/** Small ring spinner (replaces the NextUI Spinner). */
export function Spinner({ size = "md", label, className, style }: SpinnerProps) {
	return (
		<div
			role="status"
			aria-live="polite"
			className={cn("flex flex-col items-center justify-center gap-2", className)}
			style={style}
		>
			<span
				className={cn("animate-spin rounded-full border-primary/25 border-t-primary", sizes[size])}
			/>
			{label ? <span className="text-sm text-muted-foreground">{label}</span> : null}
		</div>
	);
}
