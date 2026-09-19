import { MessageCircle } from "lucide-react";
import TitlebarDropdownFallback from "@/components/titlebar/titlebar-dropdown-fallback";

export default function MessagesDropDownSkeleton() {
	return (
		<TitlebarDropdownFallback>
			<MessageCircle className={"animate-pulse"} />
		</TitlebarDropdownFallback>
	);
}
