import AISidePanel from "@/components/ai-chat/ai-sidepanel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { CustomPDFProvider } from "@/contexts/custom-pdf-context";
import { useAISidepanel } from "@/hooks/atoms/useAISidepanel";
import { useSettings } from "@/hooks/atoms/useSettings";
import useResourceByElementID from "@/queries/resources/useResourceByElementID";
import { m } from "framer-motion";
import {
	ArrowLeftToLine,
	ArrowRightToLine,
	RefreshCcw,
	WifiOff,
} from "lucide-react";
import { lazy, memo, useEffect, useMemo } from "react";
import { useResizeDetector } from "react-resize-detector";
import { useParams } from "react-router-dom";

const PdfRenderer = lazy(
	() => import("@/components/resources/pdf/pdf-renderer"),
);

function Documents() {
	const { elementId } = useParams();

	if (!elementId) {
		throw new Error("No elementId provided");
	}

	const { isLoading, isError, error, data, refetch } =
		useResourceByElementID(elementId);
	const { aiSidepanel, setAISidepanel, toggleSidebar } = useAISidepanel();
	const { ref: aiSidepanelRef } = useResizeDetector();

	const memoizedData = useMemo(() => data, [data]);

	const { settings, isHydrated } = useSettings();

	useEffect(() => {
		if (!isHydrated) return;
		setAISidepanel(
			settings.CustomPDFrenderer
				? settings.pdfAIChatSidepanelOpenByDefault
				: false,
		);
	}, [
		elementId,
		isHydrated,
		setAISidepanel,
		settings.CustomPDFrenderer,
		settings.pdfAIChatSidepanelOpenByDefault,
	]);

	if (isError && !data) {
		return (
			<UnavailableResource
				message={
					error instanceof Error
						? error.message
						: "This resource is not available right now."
				}
				onRetry={() => void refetch()}
			/>
		);
	}

	return (
		<div className="relative flex h-full max-h-full w-full flex-1 overflow-hidden">
			{data?.fromCache && (
				<div className="pointer-events-none absolute right-4 top-4 z-10">
					<Badge
						variant="outline"
						className="border-emerald-500/30 bg-background/95 text-emerald-600 shadow-sm dark:text-emerald-300"
					>
						Available offline
					</Badge>
				</div>
			)}
			{settings.CustomPDFrenderer ? (
				<CustomPDFProvider>
					<PdfRenderer
						key={memoizedData?.url}
						url={memoizedData?.url}
						filename={memoizedData?.name}
						externalIsLoading={isLoading}
					/>
				</CustomPDFProvider>
			) : (
				<DefaultPdfRenderer
					key={memoizedData?.url}
					isLoading={isLoading}
					url={memoizedData?.url}
					isAISidepanelActive={aiSidepanel}
					toggleSidebar={toggleSidebar}
				/>
			)}

			<div className="flex h-full w-fit" ref={aiSidepanelRef}>
				<m.div
					className="flex h-full max-h-full flex-row overflow-hidden"
					initial={false}
					animate={{ width: aiSidepanel ? "33vw" : 0 }}
					transition={{ duration: 0.2 }}
				>
					<AISidePanel elementId={elementId} />
				</m.div>
			</div>
		</div>
	);
}

function UnavailableResource({
	message,
	onRetry,
}: {
	message: string;
	onRetry: () => void;
}) {
	return (
		<div className="flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center">
			<div className="flex h-11 w-11 items-center justify-center rounded-full bg-muted">
				<WifiOff className="h-5 w-5 text-muted-foreground" />
			</div>
			<div>
				<h1 className="text-lg font-semibold">
					This resource is not available offline
				</h1>
				<p className="mt-1 max-w-md text-sm text-muted-foreground">{message}</p>
			</div>
			<Button type="button" variant="outline" size="sm" onClick={onRetry}>
				<RefreshCcw className="mr-2 h-3.5 w-3.5" />
				Retry
			</Button>
		</div>
	);
}

function DefaultPdfRenderer({
	isLoading,
	url,
	isAISidepanelActive,
	toggleSidebar,
}: {
	isLoading: boolean;
	url?: string;
	isAISidepanelActive: boolean;
	toggleSidebar: () => void;
}) {
	if (isLoading || !url) {
		return (
			<div className="flex h-full w-full items-center justify-center">
				<div className="h-10 w-10">
					<Loader className={"m-auto"} />
				</div>
			</div>
		);
	}

	return (
		<div className="relative flex h-full w-full items-center justify-center">
			<iframe key={url} src={url} className="h-full w-full" />
			<Button
				className="absolute inset-y-0 right-4 my-auto mr-4 group"
				variant="secondary"
				data-active={isAISidepanelActive}
				onClick={toggleSidebar}
			>
				<span className="relative h-4 w-4">
					<ArrowRightToLine className="w-4 h-4 absolute group-data-[active=false]:opacity-0 transition-all" />
					<ArrowLeftToLine className="w-4 h-4 absolute animate-in group-data-[active=true]:opacity-0 transition-all" />
				</span>
			</Button>
		</div>
	);
}

export default memo(Documents);
