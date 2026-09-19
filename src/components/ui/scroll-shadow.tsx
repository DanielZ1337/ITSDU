import { cn } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";

const FADE = 24;

/** Scroll container that fades its top/bottom edge while more content is hidden there (replaces NextUI ScrollShadow). */
export function ScrollShadow({
	className,
	style,
	children,
	onScroll,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	const ref = useRef<HTMLDivElement>(null);
	const [edges, setEdges] = useState({ top: false, bottom: false });

	const update = useCallback(() => {
		const el = ref.current;
		if (!el) return;
		const top = el.scrollTop > 0;
		const bottom = el.scrollTop + el.clientHeight < el.scrollHeight - 1;
		setEdges((prev) => (prev.top === top && prev.bottom === bottom ? prev : { top, bottom }));
	}, []);

	useEffect(() => {
		update();
		const el = ref.current;
		if (!el || typeof ResizeObserver === "undefined") return;
		const observer = new ResizeObserver(update);
		observer.observe(el);
		return () => observer.disconnect();
	}, [update]);

	const mask = `linear-gradient(to bottom, ${edges.top ? "transparent" : "black"} 0, black ${edges.top ? FADE : 0}px, black calc(100% - ${edges.bottom ? FADE : 0}px), ${edges.bottom ? "transparent" : "black"} 100%)`;

	return (
		<div
			{...props}
			ref={ref}
			onScroll={(event) => {
				update();
				onScroll?.(event);
			}}
			className={cn("overflow-y-auto", className)}
			style={{ ...style, maskImage: mask, WebkitMaskImage: mask }}
		>
			{children}
		</div>
	);
}
