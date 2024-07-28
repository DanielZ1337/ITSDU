import * as React from "react";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const inputVariants = cva(
	"transition-all flex rounded-md text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
	{
		variants: {
			variant: {
				default:
					"hover:border-foreground/50 focus-visible:hover:border-border border border-input bg-background",
				none: "",
			},
			size: {
				default: "h-10 px-3 py-2 w-full",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

export interface InputProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
		VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, variant, size, type, ...props }, ref) => {
		return (
			<input
				type={type}
				className={cn(inputVariants({ variant, size, className }))}
				ref={ref}
				{...props}
			/>
		);
	},
);
Input.displayName = "Input";

export { Input, inputVariants };
