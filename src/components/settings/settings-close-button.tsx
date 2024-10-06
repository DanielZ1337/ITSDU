import { cn } from "@/lib/utils";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

export default function SettingsCloseButton() {
	return (
		<DialogPrimitive.Close
			className={cn(
				"border-2 border-transparent",
				"no-drag absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
			)}
		>
			<X className="h-6 w-6" />
			<span className="sr-only">Close</span>
		</DialogPrimitive.Close>
	);
}
