import { AiOutlineNotification } from "react-icons/ai";
import TitlebarDropdownFallback from "@/components/titlebar/titlebar-dropdown-fallback";

export default function NotificationsDropDownSkeleton() {
	return (
		<TitlebarDropdownFallback>
			<AiOutlineNotification className={"w-7 h-7 animate-pulse"} />
		</TitlebarDropdownFallback>
	);
}
