import { useSidebar } from "@/hooks/atoms/useSidebar";
import { cn } from "@/lib/utils";

export default function SidebarGroupTitle({ title }: { title: string }) {
	const { sidebarActive } = useSidebar();

	return (
		<h3
			className={cn(
				"text-xs font-semibold text-foreground/60 uppercase tracking-wider transition-all",
				sidebarActive ? "opacity-100" : "opacity-0",
			)}
		>
			{title}
		</h3>
	);
}
