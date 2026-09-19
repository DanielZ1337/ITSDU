import { useCallback, useEffect } from "react";
import {
	calculateShadowPosition,
	type ShadowPosition,
} from "@/components/scroll-shadow";

export function useMeasureScrollPosition(
	viewportRef?: React.RefObject<HTMLDivElement | null>,
	onChange?: (position: ShadowPosition) => void,
) {
	const measureScrollHeight = useCallback(() => {
		onChange?.(calculateShadowPosition(viewportRef));
	}, [onChange, viewportRef]);

	useEffect(() => {
		if (!viewportRef) return;
		const viewportElement = viewportRef.current;

		measureScrollHeight();

		const handleScroll = () => {
			measureScrollHeight();
		};

		if (viewportElement) {
			viewportElement.addEventListener("scroll", handleScroll);

			return () => {
				viewportElement.removeEventListener("scroll", handleScroll);
			};
		}
	}, [measureScrollHeight, viewportRef]);

	useEffect(() => {
		const handleResize = () => {
			measureScrollHeight();
		};

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, [measureScrollHeight]);

	return measureScrollHeight;
}
