import {isSupportedResourceInApp} from "@/types/api-types/extra/learning-tool-id-types"
import {ItslearningRestApiEntitiesElementLink} from "@/types/api-types/utils/Itslearning.RestApi.Entities.ElementLink"
import {useNavigateToResource} from '../../types/api-types/extra/learning-tool-id-types';
import {useNavigate} from "react-router-dom";
import LightbulletinLink from "./lightbulletin-link";

export default function LightbulletinResource({resource, courseId}: {
    resource: ItslearningRestApiEntitiesElementLink,
    courseId: number | string
}) {
    const navigate = useNavigate()
    const navigateToResource = useNavigateToResource(navigate)
    return (
        <LightbulletinLink
            onClick={() => {
                if (isSupportedResourceInApp(resource)) {
                    navigateToResource(resource)
                    // @ts-ignore
                } else if (resource.ElementType === ItslearningRestApiEntitiesElementType[ItslearningRestApiEntitiesElementType.Folder]) {
                    navigate(`/courses/${courseId}/resources/${resource.ElementId}`)
                } else {
                    window.app.openExternal(resource.ContentUrl, true)
                }
            }}>
            <img src={resource.IconUrl} alt={resource.Title} className={"w-6 h-6"}/>
            <span className="truncate">{resource.Title}</span>
        </LightbulletinLink>)
}