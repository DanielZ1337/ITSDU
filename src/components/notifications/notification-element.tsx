import {isSupportedResourceInApp, useNavigateToResource} from "@/types/api-types/extra/learning-tool-id-types"
import {ItslearningRestApiEntitiesElementLink} from "@/types/api-types/utils/Itslearning.RestApi.Entities.ElementLink"
import {useNavigate} from "react-router-dom"

export default function NotificationElement({element}: { element: ItslearningRestApiEntitiesElementLink }) {
    const navigate = useNavigate()
    const navigateToResource = useNavigateToResource()

    return (
        <button onClick={() => {
            if (isSupportedResourceInApp(element)) {
                navigateToResource(element)
            } else {
                window.app.openExternal(element.ContentUrl)
            }
        }}
                className="text-blue-500 transition-colors hover:text-blue-600 hover:underline"
        >
            {element.Title}
        </button>
    )
}