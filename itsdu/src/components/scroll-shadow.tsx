import { cn } from "@/lib/utils";
import { AnimatePresence, m } from "framer-motion";

export type ShadowPosition = "top" | "bottom" | "both";

export function calculateShadowPosition(
	viewportRef?: React.RefObject<HTMLDivElement>,
): ShadowPosition {
	if (!viewportRef || !viewportRef.current) return "bottom";

	const maxScrollHeight =
		viewportRef.current.scrollHeight - viewportRef.current.clientHeight;
	const currentScrollPosition = viewportRef.current.scrollTop;

	const margin = 10;

	if (currentScrollPosition <= margin) {
		return "bottom";
	} else if (currentScrollPosition >= maxScrollHeight - margin) {
		return "top";
	} else {
		return "both";
	}
}

export function Shadow({ position }: { position: ShadowPosition }) {
	const defaultClassName =
		"pointer-events-none absolute left-0 right-0 h-24 w-full inset-x-0";

	//bg-neutral-100 dark:bg-neutral-800
	const topClassName =
		"top-0 bg-gradient-to-t from-transparent dark:to-neutral-800 to-neutral-100";
	const bottomClassName =
		"bottom-0 bg-gradient-to-b from-transparent dark:to-neutral-800 to-neutral-100";

	const topComponent = () => {
		return (
			<m.div
				key="top"
				layout
				layoutId="top"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={{ type: "just", stiffness: 500, damping: 30, mass: 0.8 }}
				className={cn(defaultClassName, topClassName)}
			/>
		);
	};

	const bottomComponent = () => {
		return (
			<m.div
				key="bottom"
				layout
				layoutId="bottom"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={{ type: "just", stiffness: 500, damping: 30, mass: 0.8 }}
				className={cn(defaultClassName, bottomClassName)}
			/>
		);
	};

	return (
		<AnimatePresence>
			{position === "top" && topComponent()}
			{position === "bottom" && bottomComponent()}
			{position === "both" && (
				<>
					{topComponent()}
					{bottomComponent()}
				</>
			)}
		</AnimatePresence>
	);
}
