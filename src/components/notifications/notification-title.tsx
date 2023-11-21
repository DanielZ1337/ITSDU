import {ItslearningRestApiEntitiesElementLink} from "@/types/api-types/utils/Itslearning.RestApi.Entities.ElementLink"
import {ItslearningRestApiEntitiesStreamItemV2} from "@/types/api-types/utils/Itslearning.RestApi.Entities.StreamItemV2"
import NotificationPublishedBy from "./notification-published-by"
import NotificationElement from "./notification-element"
import NotificationLocation from "./notification-location"

export default function NotificationTitle({notification, showLocation, setShowElements, element}: {
    notification: ItslearningRestApiEntitiesStreamItemV2,
    showLocation: boolean,
    showElements: boolean,
    setShowElements: React.Dispatch<React.SetStateAction<boolean>>,
    element?: ItslearningRestApiEntitiesElementLink
}) {
    return (
        <>
            <NotificationPublishedBy personId={notification.PublishedBy.PersonId}
                                     name={notification.PublishedBy.FullName}/>
            {notification.ElementsCount === 0 ? " made a new announcement " : " added "}
            {notification.ElementsCount !== 0 && element && <NotificationElement element={element}/>}
            {notification.ElementsCount > 1 && (
                <> and {" "}
                    <button
                        className="text-blue-500 hover:text-blue-600 transition-colors hover:underline"
                        onClick={() => setShowElements(prev => !prev)}
                    >
                        {notification.ElementsCount - 1} more
                    </button>
                </>
            )}
            {showLocation && <> in <NotificationLocation locationId={notification.LocationId}
                                                         locationTitle={notification.LocationTitle}/></>}
        </>
    )
}