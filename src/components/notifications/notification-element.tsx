import {
	isSupportedResourceInApp,
	useNavigateToResource,
} from "@/types/api-types/extra/learning-tool-id-types";
import { ItslearningRestApiEntitiesElementLink } from "@/types/api-types/utils/Itslearning.RestApi.Entities.ElementLink";
import { FileText } from "lucide-react";
import { ResourceContextMenu } from "../recursive-file-explorer";

export default function NotificationElement({
	element,
}: { element: ItslearningRestApiEntitiesElementLink }) {
	const navigateToResource = useNavigateToResource();

	return (
		<ResourceContextMenu resource={element}>
			<button
				onClick={() => {
					if (isSupportedResourceInApp(element)) {
						navigateToResource(element);
					} else {
						window.app.openExternal(element.ContentUrl);
					}
				}}
				className="inline-flex items-center gap-1 text-primary transition-colors hover:text-primary/80 hover:underline"
			>
				<FileText className="h-3.5 w-3.5" />
				{element.Title}
			</button>
		</ResourceContextMenu>
	);
}
