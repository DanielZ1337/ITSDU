import { Loader } from "@/components/ui/loader";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronLeft, ChevronRight, Expand, Minimize2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Document, Page } from "react-pdf";
import { useResizeDetector } from "react-resize-detector";
import { toast } from "sonner";
import { useCustomPDFContext } from "../../../hooks/useCustomPDF";
import { Button } from "../../ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../../ui/dialog";

interface PdfFullscreenProps {
	fileUrl?: string;
}

const PdfFullscreen = ({ fileUrl }: PdfFullscreenProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const { setNumPages, numPages, currPage, setCurrPage, setValue } = useCustomPDFContext();

	const { width, ref } = useResizeDetector();
	const [isLoading, setIsLoading] = useState(true);
	const [isInitialScrolling, setIsInitialScrolling] = useState(false);

	// Scroll to current page when opening
	useEffect(() => {
		if (isOpen) {
			// Block page visibility updates during initial scroll
			setIsInitialScrolling(true);

			// Scroll to current page after a short delay to allow rendering
			setTimeout(() => {
				const pageElement = document.querySelector(`[data-page-number="${currPage}"]`);
				pageElement?.scrollIntoView({ behavior: "instant", block: "center" });

				// Re-enable page visibility updates after scroll completes
				setTimeout(() => {
					setIsInitialScrolling(false);
				}, 100);
			}, 100);
		}
	}, [isOpen]); // Only trigger on open, not on currPage changes

	// Handle page visibility - sync back to main context in real-time
	const handlePageVisible = useCallback((pageNum: number) => {
		// Don't update during initial scroll to prevent jumping to wrong page
		if (isInitialScrolling) return;

		setCurrPage(pageNum);
		setValue("page", String(pageNum));
	}, [setCurrPage, setValue, isInitialScrolling]);

	// Handle close
	const handleClose = useCallback(() => {
		setIsOpen(false);
	}, []);

	// Keyboard navigation
	useEffect(() => {
		if (!isOpen) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				handleClose();
			} else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
				e.preventDefault();
				const newPage = Math.max(1, currPage - 1);
				setCurrPage(newPage);
				setValue("page", String(newPage));
				// Scroll to the page
				setTimeout(() => {
					const pageElement = document.querySelector(`[data-page-number="${newPage}"]`);
					pageElement?.scrollIntoView({ behavior: "smooth", block: "center" });
				}, 50);
			} else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
				e.preventDefault();
				const newPage = Math.min(numPages || currPage, currPage + 1);
				setCurrPage(newPage);
				setValue("page", String(newPage));
				// Scroll to the page
				setTimeout(() => {
					const pageElement = document.querySelector(`[data-page-number="${newPage}"]`);
					pageElement?.scrollIntoView({ behavior: "smooth", block: "center" });
				}, 50);
			} else if (e.key === "Home") {
				e.preventDefault();
				setCurrPage(1);
				setValue("page", "1");
				setTimeout(() => {
					const pageElement = document.querySelector(`[data-page-number="1"]`);
					pageElement?.scrollIntoView({ behavior: "smooth", block: "center" });
				}, 50);
			} else if (e.key === "End") {
				e.preventDefault();
				if (numPages) {
					setCurrPage(numPages);
					setValue("page", String(numPages));
					setTimeout(() => {
						const pageElement = document.querySelector(`[data-page-number="${numPages}"]`);
						pageElement?.scrollIntoView({ behavior: "smooth", block: "center" });
					}, 50);
				}
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, numPages, currPage, handleClose, setCurrPage, setValue]);

	return (
		<TooltipProvider delayDuration={300}>
			<Dialog
				open={isOpen}
				onOpenChange={(v) => {
					if (!v) {
						handleClose();
					}
				}}
			>
				<Tooltip>
					<TooltipTrigger asChild>
						<DialogTrigger onClick={() => setIsOpen(true)} asChild>
							<Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Fullscreen">
								<Expand className="h-4 w-4" />
							</Button>
						</DialogTrigger>
					</TooltipTrigger>
					<TooltipContent side="bottom">Fullscreen</TooltipContent>
				</Tooltip>
				<DialogContent className="w-full max-w-7xl no-drag p-0 gap-0 overflow-hidden bg-background" customClose={<></>}>
					{/* Fullscreen toolbar */}
					<div className="flex items-center justify-between px-4 py-2 border-b bg-muted/30">
						<div className="flex items-center gap-2">
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="ghost"
										size="icon"
										className="h-8 w-8"
										disabled={currPage <= 1}
										onClick={() => {
											const newPage = Math.max(1, currPage - 1);
											setCurrPage(newPage);
											setValue("page", String(newPage));
											setTimeout(() => {
												const el = document.querySelector(`[data-page-number="${newPage}"]`);
												el?.scrollIntoView({ behavior: "smooth", block: "center" });
											}, 50);
										}}
									>
										<ChevronLeft className="h-4 w-4" />
									</Button>
								</TooltipTrigger>
								<TooltipContent side="bottom">
									Previous <kbd className="ml-1 text-[10px] opacity-60">←</kbd>
								</TooltipContent>
							</Tooltip>

							<span className="text-sm tabular-nums min-w-[6ch] text-center">
								<span className="font-medium">{currPage}</span>
								<span className="text-muted-foreground"> / {numPages || "–"}</span>
							</span>

							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="ghost"
										size="icon"
										className="h-8 w-8"
										disabled={!numPages || currPage >= numPages}
										onClick={() => {
											const newPage = Math.min(numPages || currPage, currPage + 1);
											setCurrPage(newPage);
											setValue("page", String(newPage));
											setTimeout(() => {
												const el = document.querySelector(`[data-page-number="${newPage}"]`);
												el?.scrollIntoView({ behavior: "smooth", block: "center" });
											}, 50);
										}}
									>
										<ChevronRight className="h-4 w-4" />
									</Button>
								</TooltipTrigger>
								<TooltipContent side="bottom">
									Next <kbd className="ml-1 text-[10px] opacity-60">→</kbd>
								</TooltipContent>
							</Tooltip>
						</div>

						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className="h-8 w-8"
									onClick={handleClose}
								>
									<Minimize2 className="h-4 w-4" />
								</Button>
							</TooltipTrigger>
							<TooltipContent side="bottom">
								Exit fullscreen <kbd className="ml-1 text-[10px] opacity-60">Esc</kbd>
							</TooltipContent>
						</Tooltip>
					</div>

					<div
						ref={ref}
						className="overflow-x-hidden overflow-y-auto h-full max-h-[calc(100vh-10rem)] bg-neutral-100 dark:bg-neutral-800"
					>
						<Document
							loading={
								<div className="flex justify-center items-center h-64">
									<Loader />
								</div>
							}
							onLoadError={() => {
								toast.error("Error loading PDF", {
									description: "Please try again later",
								});
							}}
							onLoadSuccess={({ numPages }) => {
								setNumPages(numPages);
								setIsLoading(false);
							}}
							file={fileUrl}
							className="max-h-full py-4"
						>
							{Array.from(new Array(numPages), (_, index) => (
								<InViewPage
									isLoading={isLoading}
									key={index}
									pageNumber={index + 1}
									onPageVisible={handlePageVisible}
								>
									<div
										data-page-number={index + 1}
										className="relative mb-4"
									>
										<Page
											pageNumber={index + 1}
											className="shadow-lg mx-auto rounded-sm"
											loading={null}
											width={width ? width - 32 : undefined}
										/>
										{/* Page number indicator */}
										<div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm px-2 py-0.5 rounded text-xs text-muted-foreground tabular-nums">
											{index + 1}
										</div>
									</div>
								</InViewPage>
							))}
						</Document>
					</div>
				</DialogContent>
			</Dialog>
		</TooltipProvider>
	);
};

export default PdfFullscreen;

function InViewPage({
	children,
	pageNumber,
	isLoading,
	onPageVisible,
}: {
	children: React.ReactNode;
	pageNumber: number;
	isLoading: boolean;
	onPageVisible: (pageNumber: number) => void;
}) {
	const { ref } = useInView({
		threshold: 0.5,
		onChange: (inView) => {
			if (inView && !isLoading) {
				onPageVisible(pageNumber);
			}
		},
	});

	return (
		<div
			ref={ref}
			className="relative"
			style={{
				width: "100%",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			{children}
		</div>
	);
}
