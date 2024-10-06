import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function CourseTaskTabButton({
	active,
	onClick,
	children,
}: {
	active: boolean;
	onClick: () => void;
	children: React.ReactNode;
}) {
	return (
		<div className="relative flex items-center justify-center">
			<Button
				variant={active ? "secondary" : "ghost"}
				onClick={onClick}
				className={cn("h-11", active ? "text-white" : "text-gray-600")}
			>
				{children}
			</Button>
			{active && (
				<motion.div
					layoutId="active-tab-indicator"
					transition={{ duration: 0.2 }}
					className="z-10 absolute bottom-1 w-1/2 h-1 bg-purple-500 rounded-full"
				/>
			)}
		</div>
	);
}
