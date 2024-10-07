import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSidebar } from "@/hooks/atoms/useSidebar";
import { cn } from "@/lib/utils";
import { NavigationType } from "@/types/navigation-link";
import { motion } from "framer-motion";
import { NavLink, useMatch } from "react-router-dom";

export default function SidebarItem({
	title,
	icon,
	href,
	end = true,
	disabled,
}: NavigationType) {
	const { sidebarActive } = useSidebar();

	const match = useMatch(href);

	const isActive = !!match;

	return (
		<Tooltip disableHoverableContent>
			<TooltipTrigger asChild>
				<NavLink
					onClick={(e) => disabled && e.preventDefault()}
					className={cn(
						"animate-in slide-in-from-left-6",
						"relative flex items-center p-2 rounded-md cursor-pointer hover:text-foreground",
						isActive ? "text-foreground" : "text-foreground/60",
						// isPending && "opacity-50",
						disabled && "opacity-50 cursor-not-allowed",
					)}
					to={href}
					end={end}
				>
					{({ isActive }) => (
						<>
							{isActive && (
								<motion.div
									layoutId="active-pill"
									transition={{
										type: "spring",
										stiffness: 400,
										damping: 30,
										mass: 0.8,
									}}
									className={cn(
										"-mx-2 inset-y-0 w-1 absolute rounded-full bg-primary/80 transition-shadow shadow-md shadow-primary drop-shadow-[0px_-1px_6px_hsl(var(--primary))]",
										sidebarActive && "shadow-md shadow-primary/5",
									)}
								/>
							)}
							<span className="relative z-10 p-1 mx-auto">{icon}</span>
						</>
					)}
				</NavLink>
			</TooltipTrigger>
			<TooltipContent side="right">
				<span
					className={cn(
						"whitespace-nowrap text-left z-10 relative overflow-hidden transition-all",
						// 'pl-4',
						// sidebarActive ? "w-full opacity-100" : "w-0 opacity-0 ",
					)}
				>
					{title}
				</span>
			</TooltipContent>
		</Tooltip>
	);
}
