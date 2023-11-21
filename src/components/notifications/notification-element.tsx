import {isResourcePDFFromUrlOrElementType} from "@/types/api-types/extra/learning-tool-id-types"
import {ItslearningRestApiEntitiesElementLink} from "@/types/api-types/utils/Itslearning.RestApi.Entities.ElementLink"
import {useNavigate} from "react-router-dom"

export default function NotificationElement({element}: { element: ItslearningRestApiEntitiesElementLink }) {
    const navigate = useNavigate()

    return (
        <button onClick={() => {
            if (isResourcePDFFromUrlOrElementType(element.IconUrl)) {
                navigate(`/documents/${element.ElementId}`)
            } else {
                window.app.openExternal(element.ContentUrl)
            }
        }}
                className="text-blue-500 hover:text-blue-600 transition-colors hover:underline"
        >
            {element.Title}
        </button>
    )
}