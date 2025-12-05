import AISidePanel from "@/components/ai-chat/ai-sidepanel";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { CustomPDFProvider } from "@/contexts/custom-pdf-context";
import { useAISidepanel } from "@/hooks/atoms/useAISidepanel";
import { useSettings } from "@/hooks/atoms/useSettings";
import useResourceByElementID from "@/queries/resources/useResourceByElementID";
import { m } from "framer-motion";
import { ArrowLeftToLine, ArrowRightToLine } from "lucide-react";
import {
	lazy,
	memo,
	useMemo,
	useRef,
} from "react";
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

	const { isLoading, data } = useResourceByElementID(elementId);
	const { aiSidepanel, toggleSidebar } = useAISidepanel();
	const { ref: aiSidepanelRef } = useResizeDetector();

	const memoizedData = useMemo(() => data, [data]);

	const { settings } = useSettings();

	return (
		<div
			className="flex h-full max-h-full w-full flex-1 overflow-hidden"
		>
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
