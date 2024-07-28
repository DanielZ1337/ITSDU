import TitlebarDropdownFallback from "@/components/titlebar/titlebar-dropdown-fallback";
import { AiOutlineNotification } from "react-icons/ai";

export default function NotificationsDropDownSkeleton() {
	return (
		<TitlebarDropdownFallback>
			<AiOutlineNotification className={"w-7 h-7 animate-pulse"} />
		</TitlebarDropdownFallback>
	);
}
