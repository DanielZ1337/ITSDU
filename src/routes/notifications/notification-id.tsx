import renderLink from '@/components/custom-render-link-linkify'
import PersonHoverCard from '@/components/person/person-hover-card'
import useGETnotificationsStream from '@/queries/notifications/useGETnotificationsStream'
import Linkify from 'linkify-react'
import { Helmet } from 'react-helmet-async'
import { useNavigate, useParams } from 'react-router-dom'
import useGETnotificationElements from '../../queries/notifications/useGETnotificationElements'
import { isResourcePDFFromUrlOrElementType } from '@/types/api-types/extra/learning-tool-id-types'

export default function NotificationID() {
    const { notificationId } = useParams()
    const { data: notification } = useGETnotificationsStream({
        FromId: Number(notificationId),
        PageSize: 1,
        showLightBulletins: true,
    }, {
        suspense: true,
    })

    const currentNotificaton = notification!.pages[0].EntityArray[0]

    const { data: resources } = useGETnotificationElements({
        notificationId: currentNotificaton.NotificationId,
        PageSize: 9999,
    })

    const navigate = useNavigate()

    return (
        <div
            className="flex-1 flex-col w-full overflow-hidden flex p-6">
            <Helmet>
                <title>{currentNotificaton!.Text}</title>
            </Helmet>
            <h1 className="text-2xl font-bold mb-4">{currentNotificaton!.Text}</h1>
            <div className="overflow-auto m-auto w-full px-20">
                <div className="max-w-2xl m-auto dark:bg-foreground/40 bg-foreground/10 rounded-md shadow-md p-10">
                    <div className="flex items-center mb-4">
                        <img src={currentNotificaton!.IconUrl} alt="Notification Icon" className="w-6 h-6 mr-2" />
                        <h1 className="text-lg font-bold">{currentNotificaton!.LocationTitle}</h1>
                    </div>
                    <p className="mb-4">{currentNotificaton!.Text}</p>
                    {currentNotificaton!.PublishedDate && <p className="text-sm text-foreground/80 mb-4">Published Date: {new Date(currentNotificaton!.PublishedDate).toDateString()}</p>}
                    {currentNotificaton.LightBulletin && (
                        <div className="border-t border-gray-300 pt-4">
                            <h2 className="text-md font-semibold mb-2">Announcement:</h2>
                            <p className="text-sm text-foreground/80 whitespace-pre-wrap">
                                <Linkify options={{ render: renderLink }}>
                                    {currentNotificaton!.LightBulletin.Text}
                                </Linkify>
                            </p>
                        </div>
                    )}
                    {currentNotificaton!.ElementsCount > 0 && (
                        <div className="border-t border-gray-300 pt-4">
                            <h2 className="text-md font-semibold mb-2">Resources:</h2>
                            {resources?.EntityArray.map((resource) => (
                                <div key={resource.ElementId} className="flex items-center mb-2">
                                    <img src={resource.IconUrl} alt="Resource Icon" className="w-6 h-6 mr-2" />
                                    <button
                                        onClick={async () => {
                                            if (isResourcePDFFromUrlOrElementType(resource)) {
                                                navigate(`/documents/${resource.ElementId}`)
                                            } else {
                                                await window.app.openExternal(resource.ContentUrl)
                                            }
                                        }} className="text-sm text-foreground/80 hover:underline">
                                        {resource.Title}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="mt-4">
                        <PersonHoverCard personId={currentNotificaton!.PublishedBy.PersonId} showTitle={false}>
                            Published By: {currentNotificaton!.PublishedBy.FullName}
                        </PersonHoverCard>
                    </div>
                </div>
            </div>
        </div>
    )
}
