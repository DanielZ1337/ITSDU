import { Loader } from "@/components/ui/loader";
import useGETMediaDocument from "@/queries/extra/useGETMediaDocument";
import useDirectFileUrlByElementID from "@/queries/resources/useDirectFileUrlByElementID";
import useFileRepositoryResourceByElementID from "@/queries/resources/useFileRepositoryResourceByElementID";
import { memo } from "react";
import { useLocation, useParams } from "react-router-dom";

type MediaDocumentType = "video" | "image";

function MediaDocuments() {
	const { elementId } = useParams();
	const location = useLocation();
	if (!elementId || !location.state) {
		throw new Error("Invalid ID or state");
	}

	const { type } = location.state as { type: MediaDocumentType };

	if (!type || (type !== "video" && type !== "image")) {
		throw new Error("Invalid type");
	}

	// const {data, isLoading} = useGETMediaDocument(elementId)
	const { data, isLoading } = useDirectFileUrlByElementID(elementId);
	const Comp = type === "video" ? "video" : "img";

	return (
		<div className="m-auto flex h-fit max-h-full max-w-full flex-col items-center justify-center p-6">
			<div className="m-auto flex max-h-full flex-col items-center justify-center rounded-md p-4 ring ring-purple-500/50 bg-foreground/10">
				<div className="m-auto flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-md">
					{isLoading || !data ? (
						<div className="flex h-full items-center justify-center">
							<Loader size={"md"} className={"m-auto"} />
						</div>
					) : (
						<Comp
							src={data}
							{...(type === "video" && { autoPlay: true, controls: true })}
							className="object-contain m-auto flex h-full w-full items-center justify-center"
						/>
					)}
				</div>
			</div>
		</div>
	);
}

export default memo(MediaDocuments);
