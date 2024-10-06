import { isSupportedResourceInApp } from "@/types/api-types/extra/learning-tool-id-types";
import { ItslearningRestApiEntitiesElementLink } from "@/types/api-types/utils/Itslearning.RestApi.Entities.ElementLink";
import { ItslearningRestApiEntitiesElementType } from "@/types/api-types/utils/Itslearning.RestApi.Entities.ElementType";
import { useNavigate } from "react-router-dom";
import { useNavigateToResource } from "../../types/api-types/extra/learning-tool-id-types";
import { ResourceContextMenu } from "../recursive-file-explorer";
import LightbulletinLink from "./lightbulletin-link";

export default function LightbulletinResource({
	resource,
	courseId,
}: {
	resource: ItslearningRestApiEntitiesElementLink;
	courseId: number | string;
}) {
	const navigate = useNavigate();
	const navigateToResource = useNavigateToResource(navigate);
	return (
		<ResourceContextMenu resource={resource}>
			<LightbulletinLink
				onClick={() => {
					if (isSupportedResourceInApp(resource)) {
						navigateToResource(resource);
						// @ts-ignore
					} else if (
						resource.ElementType ===
						ItslearningRestApiEntitiesElementType[
							ItslearningRestApiEntitiesElementType.Folder
						]
					) {
						navigate(`/courses/${courseId}/resources/${resource.ElementId}`);
					} else {
						window.app.openExternal(resource.ContentUrl, true);
					}
				}}
			>
				<img
					loading="lazy"
					src={resource.IconUrl}
					alt={resource.Title}
					className={"w-6 h-6"}
				/>
				<span className="truncate">{resource.Title}</span>
			</LightbulletinLink>
		</ResourceContextMenu>
	);
}
