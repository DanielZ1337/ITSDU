import { Separator } from "@/components/ui/separator.tsx";
import { AlertCircle } from "lucide-react";

export default function NotificationsDropdownInfiniteEnd() {
	return (
		<>
			<Separator className={"my-2"} />
			<div className="flex h-32 w-full flex-col items-center justify-center py-6">
				<AlertCircle className={"stroke-destructive shrink-0"} />
				<h3 className="mt-4 text-xl font-medium text-foreground">
					No more notifications
				</h3>
				<p className="px-6 text-center text-muted-foreground">
					You have reached the end of your notifications.
				</p>
			</div>
		</>
	);
}
