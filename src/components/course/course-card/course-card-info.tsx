import { cn } from "@/lib/utils.ts";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function CourseCardInfo({
	icon,
	count,
	className,
	href,
	label,
}: {
	icon: React.ReactNode;
	count: number;
	className?: string;
	href?: string;
	label?: string;
}) {
	const navigate = useNavigate();

	return (
		<motion.button
			type="button"
			whileHover={{ scale: 1.05 }}
			whileTap={{ scale: 0.95 }}
			onClick={(e) => {
				if (href) {
					e.stopPropagation();
					navigate(href);
				}
			}}
			className={cn(
				"group/info relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg",
				"bg-secondary/50 dark:bg-secondary/30",
				"text-muted-foreground text-xs font-medium",
				"hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20",
				"transition-colors duration-200",
				"focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
				href && "cursor-pointer",
				className,
			)}
			title={label}
		>
			<span className="w-3.5 h-3.5 [&>svg]:w-full [&>svg]:h-full shrink-0">
				{icon}
			</span>
			<span className="tabular-nums">{count}</span>
		</motion.button>
	);
}
