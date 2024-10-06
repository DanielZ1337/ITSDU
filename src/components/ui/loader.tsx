import { type VariantProps, cva } from "class-variance-authority";
import { Loader2, LucideProps } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const loaderVariants = cva("animate-spin shrink-0", {
	variants: {
		variant: {
			default: "stroke-foreground text-foreground",
			white: "stroke-white text-white",
			black: "stroke-black text-black",
			destructive: "stroke-destructive text-destructive-foreground",
			success: "stroke-success text-success-foreground",
		},
		size: {
			md: "h-8 w-8",
			default: "h-6 w-6",
			sm: "h-5 w-5",
			xs: "h-4 w-4",
			lg: "h-10 w-10",
			xl: "h-12 w-12",
		},
	},
	defaultVariants: {
		variant: "default",
		size: "default",
	},
});

interface LoaderProps
	extends Omit<LucideProps, "size">,
		VariantProps<typeof loaderVariants> {}

const Loader = React.forwardRef<SVGSVGElement, LoaderProps>(
	({ className, variant, size, ...props }, ref) => {
		return (
			<Loader2
				className={cn(loaderVariants({ variant, size, className }))}
				ref={ref}
				{...props}
			/>
		);
	},
);

Loader.displayName = "Loader";

export { Loader, loaderVariants };
