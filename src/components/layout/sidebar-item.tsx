import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { NavigationType } from "@/types/navigation-link";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { NavLink, useMatch } from "react-router-dom";

export default function SidebarItem({
	title,
	icon,
	href,
	end = true,
	disabled,
}: NavigationType) {
	const match = useMatch(href);
	const isActive = !!match;
	const [isHovering, setIsHovering] = useState(false);

	return (
		<Tooltip disableHoverableContent>
			<TooltipTrigger asChild>
				<NavLink
					onMouseEnter={() => setIsHovering(true)}
					onMouseLeave={() => setIsHovering(false)}
					onClick={(e) => disabled && e.preventDefault()}
					className={cn(
						"group/item relative flex items-center justify-center",
						"p-2.5 mx-1 rounded-xl cursor-pointer",
						"transition-all duration-200 ease-out",
						"hover:bg-foreground/[0.08] active:scale-95",
						isActive
							? "text-foreground"
							: "text-muted-foreground hover:text-foreground",
						disabled && "opacity-40 cursor-not-allowed pointer-events-none",
					)}
					to={href}
					end={end}
				>
					{({ isActive }) => (
						<>
							{/* Active indicator pill with glow */}
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
										"absolute -left-1.5 inset-y-0 w-1 rounded-full",
										"bg-primary/80 shadow-md shadow-primary",
										"drop-shadow-[0px_0px_8px_hsl(var(--primary))]",
									)}
								/>
							)}

							{/* Hover indicator pill */}
							<AnimatePresence mode="popLayout">
								{!isActive && isHovering && (
									<motion.div
										initial={{ opacity: 0, scale: 0.8 }}
										animate={{ opacity: 1, scale: 1 }}
										exit={{ opacity: 0, scale: 0.8 }}
										transition={{
											duration: 0.15,
											ease: "easeOut",
										}}
										className={cn(
											"absolute -left-1.5 inset-y-1 w-1 rounded-full",
											"bg-muted-foreground/40",
										)}
									/>
								)}
							</AnimatePresence>

							{/* Icon with subtle scale on hover */}
							<span className={cn(
								"relative z-10 transition-transform duration-200",
								"group-hover/item:scale-110",
							)}>
								{icon}
							</span>
						</>
					)}
				</NavLink>
			</TooltipTrigger>
			<TooltipContent
				side="right"
				sideOffset={8}
				className="font-medium"
			>
				{title}
			</TooltipContent>
		</Tooltip>
	);
}
