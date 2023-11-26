import TitlebarDropdownFallback from "@/components/titlebar/titlebar-dropdown-fallback";
import { MessageCircle } from "lucide-react";

export default function MessagesDropDownSkeleton() {
    return (
        <TitlebarDropdownFallback>
            <MessageCircle
                className={"animate-pulse"} />
        </TitlebarDropdownFallback>
    )
}